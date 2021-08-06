---
title: Loading a `rust` library as a `lua` module in Neovim
category: blog
date: Thu Aug  5 23:17:49 MDT 2021
tags: rust, neovim, lua
keywords: rust, nvim, neovim, lua, mlua
summary: Using mlua to load a rust cdylib shared library crate as a lua module
---

Neovim v0.5.0 is out and has good support for using `lua` as an alternative to `vimscript`.
You can using a `init.lua` file instead of a `.vimrc`.

`Lua` is a pretty neat language: it is small, portable and fast when using `luajit`, which neovim supports.
It is a clean simple language, and has support for some metaprogramming constructs and syntactic sugar that make code easy to read and write.

However, there are a few things that can be quite odd or annoying.
There is no support for `continue` statements (although there are acceptable workarounds using `repeat break until true`).
The standard library for string handling and manipulation has the bare minimum (although packages from `LuaRocks` are more than enough to fill this void).
As far as I can tell, there's no Unicode support.

These are quite minor gripes in the language.
There are also programming languages like fennel (a language that uses lisp syntax and provides a macro system), that compile _to_ `lua`.
And naturally, the neovim community have built excellent tools like Aniseed and Hotpot.nvim to make it possible to write your entire configuration in fennel instead of `lua`.

I was curious if it would be possible to write a `lua` plugin with `rust`. It turns out this is quite straightforward.

![](https://user-images.githubusercontent.com/1813121/128466216-52621bfd-30cb-4d4c-babb-297c99cb79eb.png)

# How it works

`Rust` can compile down to a shared library that exposes a C API.
When a `require 'mymodule'` expression is encountered in `lua`, the `lua` interpreter searches for `mymodule.lua` and `mymodule.so` files in a bunch of predefined locations.
This is the output of typing `:lua require'mymodule'` in neovim:

```txt
E5108: Error executing lua [string ":lua"]:1: module 'mymodule' not found:
        no field package.preload['mymodule']
        no file './mymodule.lua'
        no file '/Users/runner/work/neovim/neovim/.deps/usr/share/luajit-2.1.0-beta3/mymodule.lua'
        no file '/usr/local/share/lua/5.1/mymodule.lua'
        no file '/usr/local/share/lua/5.1/mymodule/init.lua'
        no file '/Users/runner/work/neovim/neovim/.deps/usr/share/lua/5.1/mymodule.lua'
        no file '/Users/runner/work/neovim/neovim/.deps/usr/share/lua/5.1/mymodule/init.lua'
        no file '/Users/USER/.cache/nvim/packer_hererocks/2.1.0-beta3/share/lua/5.1/mymodule.lua'
        no file '/Users/USER/.cache/nvim/packer_hererocks/2.1.0-beta3/share/lua/5.1/mymodule/init.lua'
        no file '/Users/USER/.cache/nvim/packer_hererocks/2.1.0-beta3/lib/luarocks/rocks-5.1/mymodule.lua'
        no file '/Users/USER/.cache/nvim/packer_hererocks/2.1.0-beta3/lib/luarocks/rocks-5.1/mymodule/init.lua'
        no file './mymodule.so'
        no file '/usr/local/lib/lua/5.1/mymodule.so'
        no file '/Users/runner/work/neovim/neovim/.deps/usr/lib/lua/5.1/mymodule.so'
        no file '/usr/local/lib/lua/5.1/loadall.so'
        no file '/Users/USER/.cache/nvim/packer_hererocks/2.1.0-beta3/lib/lua/5.1/mymodule.so'
```

If a `mymodule.so` file exists, `lua` checks if it can call `luaopen_mymodule` as a function using the C ABI: <https://www.lua.org/pil/26.2.html>

This is the building blocks of how to write a `lua` module in C:

```c
static int l_dir (lua_State *L) {
    ...
}

static const struct luaL_reg mylib [] = {
  {"dir", l_dir},
  {NULL, NULL}  /* sentinel */
};

...

int luaopen_mymodule (lua_State *L) {
  luaL_openlib(L, "mymodule", mymodule, 0);
  return 1;
}
```

This is not unlike how `Python` loads C shared libraries as `Python` modules.

This means any shared library that exposes the C ABI that `lua` expects is a valid `lua` module.
This also means you can create a `lua` module that can be imported in neovim's built in `lua` interpreter from any programming language that allows you to create shared libraries.

Enter `rust`. There's a actively maintained project called [`mlua`](https://github.com/khvzak/mlua/) that lets you create `lua` libraries from `rust` code.
I've created a project here as an example of this here: <https://github.com/kdheepak/moonshine.nvim>

First, you will need the following in your Cargo.toml:

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
mlua = {version = "*", features = ["luajit", "vendored", "module", "macros"]}
```

It is important to use the `features` flag and add `luajit`, `vendored`, and `module` to the list.

We can create a file `src/lib.rs` with the following contents:

```rust
use mlua::chunk;
use mlua::prelude::*;

fn hello(lua: &Lua, name: String) -> LuaResult<LuaTable> {
    let t = lua.create_table()?;
    let _globals = lua.globals();
    lua.load(chunk! {
        print("hello, " .. $name)
    })
    .exec()?;
    t.set("hello", name)?;
    Ok(t)
}

#[mlua::lua_module]
fn moonshine(lua: &Lua) -> LuaResult<LuaTable> {
    let exports = lua.create_table()?;
    exports.set("hello", lua.create_function(hello)?)?;
    Ok(exports)
}
```

The name of the function that is annotated with the `#[mlua::lua_module]` must be the name of the `lua` module you intend to build. In this case, it is `moonshine`.

For MacOS, we also have to add the following to `.cargo/config`:

```config
[target.x86_64-apple-darwin]
rustflags = [
  "-C", "link-arg=-undefined",
  "-C", "link-arg=dynamic_lookup",
]

[target.aarch64-apple-darwin]
rustflags = [
  "-C", "link-arg=-undefined",
  "-C", "link-arg=dynamic_lookup",
]
```

This is because we need to tell the `rust` linker that the symbols used in the shared library that we are creating may not be defined at link time, and will only be available when the shared library is loaded.

```
$ tree -a
.
├── .cargo
│  └── config
├── .gitignore
├── Cargo.lock
├── Cargo.toml
├── lua
│  ├── .gitkeep
│  └── moonshine.so
├── README.md
└── src
   └── lib.rs
```

Finally, we can create an instance of the shared library using `cargo build --release`:

```bash
$ cargo build --release && mv target/release/libmoonshine.dylib lua/moonshine.so
```

neovim adds the `lua` folder of plugins to the `runtimepath`. We can add this folder to neovim using `packadd` or using Packer:

```lua
local packer = require('packer')
local use = packer.use
packer.reset()

packer.startup({
  function()
    use {
      '~/gitrepos/moonshine.nvim',
    }
  end
})
```

Now in neovim, you can run `:lua print(vim.inspect(require'moonshine`.hello("rust")))`:

![rust-lua-nvim mov](https://user-images.githubusercontent.com/1813121/128464855-5da25f9e-5d6d-42e0-b970-adadd8254dc0.gif)

# Why is this useful

`Rust` has well established libraries for parsing datetime, dealing with unicode, for concurrency and parallelism.

A similar approach can be used to write a `lua` plugin in [`nim` using `nimLUA`](https://github.com/jangko/nimLUA) or in [`Go` using `gopher-lua`](https://github.com/yuin/gopher-lua) or in any language of your choice that can compile to a shared library.
