Title:How to install gdb on OSX
Date:Thu Aug 27 10:52:17 MDT 2015
Category:blog
Summary:Installing gdb and fixing the certificate issue
Status:draft

    brew tap homebrew/dupes 
    brew install gdb
    

Certificate issue can be resolved by the following steps

    sudo security add-trust -d -r trustRoot -p basic -p codeSign -k /Library/Keychains/System.keychain ~/Desktop/gdb-cert.cer   
