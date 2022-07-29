use quote::quote;
use sha2::Digest;
use proc_macro::TokenStream;

#[proc_macro]
pub fn foobar(item: TokenStream) -> TokenStream {
    let foo = item.to_string();
    let mut foo = foo.chars();
    foo.next();
    foo.next_back();
    let foo = foo.as_str();


    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();

    let here = std::path::Path::new(&manifest_dir);

    let fin = here.join(foo);

    let content = std::fs::read(&fin).unwrap();
    let hash = &sha2::Sha256::digest(&content);
    let fin = fin.into_os_string().into_string().unwrap();

    (quote! {
        ::baz::Ass{ content: include_bytes!(#fin), sha256: [#(#hash),*], content_encoding: ::baz::ContentEncoding::Identity }
    }).into()
}


/*
#[proc_macro]
pub fn asset_sha256(item: TokenStream) -> TokenStream {

    let foo = item.to_string();
    let mut foo = foo.chars();
    foo.next();
    foo.next_back();
    let foo = foo.as_str();


    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();

    let here = std::path::Path::new(&manifest_dir);

    let fin = here.join(foo);

    let content = std::fs::read(&fin).unwrap();
    let hash = &sha2::Sha256::digest(&content);

    quote! { [#(#hash).*] }.into()
}
*/
