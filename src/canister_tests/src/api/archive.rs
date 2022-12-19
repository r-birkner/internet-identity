use crate::framework;
use crate::framework::CallError;
use ic_cdk::api::management_canister::main::CanisterStatusResponse;
use ic_state_machine_tests::{CanisterId, PrincipalId, StateMachine};
use internet_identity_interface::archive::*;
use internet_identity_interface::*;

pub fn add_entry(
    env: &StateMachine,
    canister_id: CanisterId,
    sender: PrincipalId,
    anchor: UserNumber,
    timestamp: Timestamp,
    entry: Vec<u8>,
) -> Result<(), CallError> {
    framework::call_candid_as(
        env,
        canister_id,
        sender,
        "write_entry",
        (anchor, timestamp, entry),
    )
}

pub fn get_entries(
    env: &StateMachine,
    canister_id: CanisterId,
    idx: Option<u64>,
    limit: Option<u16>,
) -> Result<Entries, CallError> {
    framework::query_candid(env, canister_id, "get_entries", (idx, limit)).map(|(x,)| x)
}

pub fn get_anchor_entries(
    env: &StateMachine,
    canister_id: CanisterId,
    anchor: UserNumber,
    cursor: Option<Cursor>,
    limit: Option<u16>,
) -> Result<AnchorEntries, CallError> {
    framework::query_candid(
        env,
        canister_id,
        "get_anchor_entries",
        (anchor, cursor, limit),
    )
    .map(|(x,)| x)
}

pub fn status(
    env: &StateMachine,
    canister_id: CanisterId,
) -> Result<CanisterStatusResponse, CallError> {
    framework::call_candid(env, canister_id, "status", ()).map(|(x,)| x)
}

pub fn http_request(
    env: &StateMachine,
    canister_id: CanisterId,
    http_request: HttpRequest,
) -> Result<HttpResponse, CallError> {
    framework::query_candid(env, canister_id, "http_request", (http_request,)).map(|(x,)| x)
}
