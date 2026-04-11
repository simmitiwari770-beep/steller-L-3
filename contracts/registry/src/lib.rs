#![no_std]
use soroban_sdk::{contract, contractimpl, Env, String, Address, symbol_short, Symbol};

const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct RegistryContract;

#[contractimpl]
impl RegistryContract {
    /// Stores data for a user and increments a global counter
    pub fn set_data(env: Env, user: Address, content: String) {
        user.require_auth();
        
        // Save user data
        env.storage().persistent().set(&user, &content);
        
        // Increment global counter
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&COUNTER, &count);
        
        // Emit events
        env.events().publish((symbol_short!("registry"), symbol_short!("set")), (user, content));
        env.events().publish((symbol_short!("registry"), symbol_short!("count")), count);
    }

    /// Retrieves data for a specific user
    pub fn get_data(env: Env, user: Address) -> Option<String> {
        env.storage().persistent().get(&user)
    }

    /// Retrieves the total number of registrations
    pub fn get_count(env: Env) -> u32 {
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }
}

mod test;
