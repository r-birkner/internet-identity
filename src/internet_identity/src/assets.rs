// All assets
//
// This file describes which assets are used and how (content, content type and content encoding).

use crate::{ASSETS, STATE};
use ic_cdk::api;
use lazy_static::lazy_static;
use sha2::Digest;

lazy_static! {
    // The <script> tag that sets the canister ID and loads the 'index.js'
    static ref INDEX_HTML_SETUP_JS: String = {
        let canister_id = api::id();
        format!(r#"var canisterId = '{canister_id}';let s = document.createElement('script');s.async = false;s.src = 'index.js';document.head.appendChild(s);"#)
    };

    // The SRI sha256 hash of the script tag, used by the CSP policy.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
    pub static ref INDEX_HTML_SETUP_JS_SRI_HASH: String = {
        let hash = &sha2::Sha256::digest(INDEX_HTML_SETUP_JS.as_bytes());
        let hash = base64::encode(hash);
        format!("sha256-{hash}")
    };

    // The full content of the index.html, after the canister ID (and script tag) have been
    // injected
    static ref INDEX_HTML_STR: String = {
        let index_html = include_str!("../../../dist/index.html");
        let setup_js: String = INDEX_HTML_SETUP_JS.to_string();
        let index_html = index_html.replace(
            r#"<script id="setupJs"></script>"#,
            &format!(r#"<script id="setupJs">{setup_js}</script>"#).to_string()
        );
        index_html
    };

    static ref INDEX_HTML: ::baz::Ass = {
        let hash = sha2::Sha256::digest(INDEX_HTML_SETUP_JS.as_bytes()).into();

        ::baz::Ass {
            content: INDEX_HTML_STR.as_bytes(),
            sha256: hash,
            content_encoding: ::baz::ContentEncoding::Identity,
            content_type: "text/html",
        }
    };
}

// used both in init and post_upgrade
pub fn init_assets() {
    STATE.with(|s| {
        let mut asset_hashes = s.asset_hashes.borrow_mut();

        ASSETS.with(|a| {
            let mut assets = a.borrow_mut();
            for (path, ass) in get_assets() {
                asset_hashes.insert(path, ass.sha256);
                let mut headers = match ass.content_encoding {
                    ::baz::ContentEncoding::Identity => vec![],
                    ::baz::ContentEncoding::GZip => {
                        vec![("Content-Encoding".to_string(), "gzip".to_string())]
                    }
                };
                headers.push(("Content-Type".to_string(), ass.content_type.to_string()));
                assets.insert(path, (headers, &ass.content));
            }
        });
    });
}

static INDEX_JS: &'static ::baz::Ass = &::foobar::asset_gzipped!("../../dist/index.js");
static LOADER_WEBP: &'static ::baz::Ass = &::foobar::asset!("../../dist/loader.webp");
static FAVICON_ICO: &'static ::baz::Ass = &::foobar::asset!("../../dist/favicon.ico");
static IC_BADGE_SVG: &'static ::baz::Ass = &::foobar::asset!("../../dist/ic-badge.svg");

// Get all the assets. Duplicated assets like index.html are shared and generally all assets are
// prepared only once (like injecting the canister ID).
fn get_assets() -> [(&'static str, &'static ::baz::Ass); 8] {
    [
        ("/", &INDEX_HTML),
        ("/faq", &INDEX_HTML),
        ("/about", &INDEX_HTML),
        ("/index.html", &INDEX_HTML),
        ("/index.js", INDEX_JS),
        ("/loader.webp", LOADER_WEBP),
        ("/favicon.ico", FAVICON_ICO),
        ("/ic-badge.svg", IC_BADGE_SVG),
    ]
}
