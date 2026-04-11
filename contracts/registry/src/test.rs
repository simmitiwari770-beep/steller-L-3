#![cfg(test)]

use super::*;
use soroban_sdk::{Env, Address, String};

#[test]
fn test_registry_and_counter() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, RegistryContract);
    let client = RegistryContractClient::new(&env, &contract_id);

    let user_1 = Address::generate(&env);
    let user_2 = Address::generate(&env);
    
    let content_1 = String::from_str(&env, "First entry");
    let content_2 = String::from_str(&env, "Second entry");

    // Initial state
    assert_eq!(client.get_count(), 0);

    // User 1 registers
    client.set_data(&user_1, &content_1);
    assert_eq!(client.get_data(&user_1), Some(content_1));
    assert_eq!(client.get_count(), 1);

    // User 2 registers
    client.set_data(&user_2, &content_2);
    assert_eq!(client.get_data(&user_2), Some(content_2));
    assert_eq!(client.get_count(), 2);
}
