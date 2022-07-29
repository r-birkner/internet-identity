use quote::quote;
use sha2::Digest;
use proc_macro::TokenStream;

#[proc_macro]
pub fn asset(item: TokenStream) -> TokenStream {
    let foo = item.to_string();
    let mut foo = foo.chars();
    foo.next();
    foo.next_back();
    let foo = foo.as_str();

    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();

    let here = std::path::Path::new(&manifest_dir);

    let fin = here.join(foo);

    let content_type = match fin.extension() {
        None => panic!("No extension for file '{:?}'", fin),
        Some(ostr) => match ostr.to_str() {
        Some("js") => "text/javascript",
        Some("ico") => "image/vnd.microsoft.icon",
        Some("webp") => "image/webp",
        Some("svg") => "image/svg+xml",
        Some(e) => panic!("unknown content type for extension '.{:?}' for file '{:?}'", e, fin),
        None => panic!("Could not read extension for file '{:?}'", fin),
        }
    };

    let content = std::fs::read(&fin).unwrap();
    let hash = &sha2::Sha256::digest(&content);
    let fin = fin.into_os_string().into_string().unwrap();


    (quote! {
        ::baz::Ass{
            content: include_bytes!(#fin),
            sha256: [#(#hash),*],
            content_encoding: ::baz::ContentEncoding::Identity,
            content_type: #content_type,

        }
    }).into()
}

#[proc_macro]
pub fn asset_gzipped(item: TokenStream) -> TokenStream {
    let foo = item.to_string();
    let mut foo = foo.chars();
    foo.next();
    foo.next_back();
    let foo = foo.as_str();

    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();

    let here = std::path::Path::new(&manifest_dir);

    let mut fin = here.join(foo);

    let content_type = match fin.extension() {
        None => panic!("No extension for file '{:?}'", fin),
        Some(ostr) => match ostr.to_str() {
        Some("js") => "text/javascript",
        Some("ico") => "image/vnd.microsoft.icon",
        Some("webp") => "image/webp",
        Some("svg") => "image/svg+xml",
        Some(e) => panic!("unknown content type for extension '.{:?}' for file '{:?}'", e, fin),
        None => panic!("Could not read extension for file '{:?}'", fin),
        }
    };

    println!("reading content");
    let content = std::fs::read(&fin).unwrap();
    let hash = &sha2::Sha256::digest(&content);
    println!("running gzip");

    std::process::Command::new("gzip").args([&fin]).output().expect("failed to gzip");
    println!("done gzip");

    let extension = fin.extension().unwrap().to_str().unwrap();
    fin.set_extension(format!("{}.gz", extension));

    let fin = fin.into_os_string().into_string().unwrap();
    println!("Ok gzipedd should be {:?}:", fin);

    (quote! {
        ::baz::Ass{
            content: include_bytes!(#fin),
            sha256: [#(#hash),*],
            content_encoding: ::baz::ContentEncoding::GZip,
            content_type: #content_type,
        }
    }).into()
}
