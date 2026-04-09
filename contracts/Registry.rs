#![no_std]
use soroban_sdk::{contract, contractimpl, Env, String, Address, symbol_short, Symbol};

const DATA_KEY: Symbol = symbol_short!("DATA");

@contract
export struct RegistryContract;

@contractimpl
impl RegistryContract {
    /// Stores the provided data associated with the user's address.
    pub fn set_data(env: Env, user: Address, content: String) {
        user.require_auth();
        env.storage().persistent().set(&user, &content);
        
        // Emit an event
        env.events().publish((symbol_short!("registry"), user), content);
    }

    /// Retrieves the data associated with the provided address.
    pub fn get_data(env: Env, user: Address) -> Option<String> {
        env.storage().persistent().get(&user)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env, Address, String};

    #[test]
    fn test_set_get() {
        let env = Env::default();
        let contract_id = env.register_contract(None, RegistryContract);
        let client = RegistryContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let content = String::from_str(&env, "Hello Soroban!");

        client.set_data(&user, &content);
        let result = client.get_data(&user);

        assert_eq!(result, Some(content));
    }
}
