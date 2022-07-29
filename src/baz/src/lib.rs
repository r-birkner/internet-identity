pub struct Ass {
    pub content: &'static [u8],
    pub sha256: [u8; 32],
    pub content_encoding: ContentEncoding,

}

#[derive(Debug, PartialEq, Eq)]
pub enum ContentEncoding {
    Identity,
    GZip,
}

#[derive(Debug, PartialEq, Eq)]
pub enum ContentType {
    HTML,
    JS,
    ICO,
    WEBP,
    SVG,
}
