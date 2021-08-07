---
title: Loading a Rust library as a Lua module in Neovim
category: blog
date: 2021-08-06T00:35:00-07:00
tags: rust, neovim, lua
keywords: rust, nvim, neovim, lua, mlua
summary: Using mlua to load a rust cdylib shared library crate as a lua module
---

I was curious if it would be possible to write a lua plugin with rust. It turns out this is quite straightforward.

![](https://user-images.githubusercontent.com/1813121/128466216-52621bfd-30cb-4d4c-babb-297c99cb79eb.png){.fullwidth}

TLDR: You can use rust with a library like [`mlua`](https://github.com/khvzak/mlua) to compile a cdylib shared library that is also a valid lua module which then can be loaded by neovim. The link to the git tree for all the code in this blog post is [here](https://github.com/kdheepak/moonshine.nvim/tree/d5b3893b7813e3a46a079d074ef1360c885a5e39).

# Motivation

[Neovim v0.5.0 is out](https://github.com/neovim/neovim/releases/tag/v0.5.0) and has good support for using lua as an alternative to vimscript.
You can now use a `init.lua` file instead of a `.vimrc`.
There are also now a bunch of really awesome plugins written in pure lua[^curated].

[^curated]: You can find curated lists of neovim plugins and related projects [here](https://github.com/rockerBOO/awesome-neovim) and [here](http://neovimcraft.com/).

One reason I think there's a lot of neat neovim plugins is that lua is a pretty neat language: it is small, portable and fast when using luajit, which neovim supports.
Lua is a clean and simple language, and has support for some nice metaprogramming constructs and syntactic sugar that make code easy to read and write.

However, there are a few things that can be quite odd or annoying when writing code in lua.
There is no support for `continue` statements (although there is an acceptable workaround using `repeat break until true`).
The standard library for string handling and manipulation quite bare bones, and users have to heavily rely on using `string:gsub` with regex patterns.
And as far as I can tell, there's no Unicode support in the language.
Neovim also uses lua 5.1, since that is the latest version of lua that works with luajit.
And this means some of the improvements in lua 5.2 and lua 5.3 are not available to neovim users.

Admittedly, these are quite minor gripes in the language.
And there are lots of awesome packages from [LuaRocks](https://luarocks.org/) that more than make up for the lack of a batteries included standard library in lua.

Additionally, there are programming languages like [Fennel](https://fennel-lang.org/) (a language that uses lisp syntax and provides a macro system), that compile _to_ lua.
And naturally, the neovim community have built excellent tools like [Aniseed](https://github.com/Olical/aniseed) and [hotpot.nvim](https://github.com/rktjmp/hotpot.nvim) to make it possible to write your entire configuration in fennel instead of lua.
Using fennel and the macro support provided by the language can make the configuration of your neovim settings concise and clean.
Alternatively, there's even a [TypeScript to lua transpiler](https://github.com/TypeScriptToLua/TypeScriptToLua), for those so inclined.

I figured it would be nice to write a lua plugin in pure rust.
Rust has metaprogramming features like macros, has a batteries included standard library and a thriving package ecosystem to boot.
And more importantly, I like writing code in rust.

Traditionally, writing a neovim plugin in rust can be achieved by neovim's rpc mechanism^[<https://github.com/killthemule/nvim-rs>].
However I was just curious to see what it would take to make it happen using a native lua module.
This blog post is a summary of the scaffolding required to get a hello world lua plugin written in rust set up.

# How it works

When a `require 'mymodule'` expression is encountered in lua, the lua interpreter searches for `mymodule.lua` and `mymodule.so` files in a bunch of predefined locations.
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

If a `mymodule.so` file exists, lua checks if it can call `luaopen_mymodule` as a function using the C ABI: <https://www.lua.org/pil/26.2.html>

From the link above, this is the template one would follow to write a lua module in C:

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

This means any shared library that exposes the C ABI that lua expects is also a valid lua module.
And therefore you can create a lua module that can be imported in neovim's built in lua interpreter from any programming language that allows you to create shared libraries.

Enter rust.
Rust can compile into a shared library exposing a C ABI.
All one would have to do is expose the functions required for a valid lua module.
However, without any third party support however, this will involve lots of `unsafe` code.
Fortunately, there's a actively maintained project called [`mlua`](https://github.com/khvzak/mlua/) that lets you create a lua module from a rust library (among other features supported by `mlua`) using rust's metaprogramming constructs.

First, you will need the following in your Cargo.toml:

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
mlua = {version = "*", features = ["luajit", "vendored", "module", "macros"]}
```

It is important to use the `features` flag and add `luajit`, `vendored`, and `module` to the list.

Now we can create a file `src/lib.rs` with the following contents:

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

This is equivalent to the following lua code:

```lua
local M = {}

function M.hello(name)
  print("hello, " .. name)
  return { name = name }
end

return M
```

The name of the function that is annotated with the `#[mlua::lua_module]` must be the name of the lua module you intend to build. In my case, I called the function `moonshine`. This will allow me to use `require'moonshine` in lua.

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

We need to do this because we need to tell the rust linker that the symbols used in the shared library may not be defined at link time, and will only be available when the shared library is loaded.

Finally, we can create an instance of the shared library using `cargo build --release`.
Neovim adds the lua folder of plugins to the `runtimepath`.
So to follow convention, we can move `libmoonshine.dylib` to the lua folder.
Lua looks for `.so` files even on a Mac, so we have to rename the file.
Notice rust compiles the library to `libmoonshine.dylib`, but the lua module need to be `moonshine.so`.

```bash
$ cargo build --release && mv target/release/libmoonshine.dylib lua/moonshine.so
```

Here is a tree view of the folder structure.

```bash
$ tree -a
.
├── .cargo
│  └── config
├── .git
│  └── ...
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

We can add this folder manually to neovim's runtimepath using the `packadd` or using the [Packer](https://github.com/wbthomason/packer.nvim) package manager:

```lua
local execute = vim.api.nvim_command
local fn = vim.fn

local install_path = fn.stdpath('data')..'/site/pack/packer/start/packer.nvim'

if fn.empty(fn.glob(install_path)) > 0 then
  fn.system({'git', 'clone', 'https://github.com/wbthomason/packer.nvim', install_path})
  execute 'packadd packer.nvim'
end

local packer = require('packer')
local use = packer.use

packer.startup({
  function()
    use {
      '~/gitrepos/moonshine.nvim',
    }
  end
})
```

Now in neovim, after a `PackerInstall` and `PackerCompiler` you can run `:lua print(vim.inspect(require'moonshine`.hello("rust")))`:

![](https://user-images.githubusercontent.com/1813121/128464855-5da25f9e-5d6d-42e0-b970-adadd8254dc0.gif){.fullwidth}

Tada!

# Why is this useful

Rust has well established libraries for parsing datetime, dealing with unicode, for concurrency and parallelism, and much much more. This can be useful in developing a lua plugin for neovim that wants to expose features available in a rust package.

A similar approach can probably be used to write a lua plugin in [`nim` using `nimLUA`](https://github.com/jangko/nimLUA) or in [`Go` using `gopher-lua`](https://github.com/yuin/gopher-lua) or in any language of your choice that can compile to a shared library.
