pub struct Ass {
    pub content: &'static [u8],
    pub sha256: [u8; 32],
    pub content_encoding: ContentEncoding,
    pub content_type: &'static str,
}

#[derive(Debug, PartialEq, Eq)]
pub enum ContentEncoding {
    Identity,
    GZip,
}
