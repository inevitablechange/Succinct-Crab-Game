use clap::Parser;
use sp1_sdk::{include_elf, ProverClient, SP1Stdin, utils};
use std::env;

/// Include the ELF file for the SP1 zkVM program.
const GAME_SCORE_ELF: &[u8] = include_elf!("snake-game-program");

/// Command-line arguments for the program.
#[derive(Parser, Debug)]
#[clap(author, version, about)]
struct Args {
    /// Execute the program without generating a proof.
    #[clap(long)]
    execute: bool,

    /// Generate a proof for the program execution.
    #[clap(long)]
    prove: bool,

    /// The game score to be processed.
    #[clap(long, default_value = "0")]
    score: u32,
}

fn main() {
    // Setup logging (useful for debugging)
    utils::setup_logger();

    // Set SP1 to run on CPU mode instead of Docker
    env::set_var("SP1_PROVER", "cpu");

    // Parse command-line arguments
    let args = Args::parse();

    // Ensure only one mode is selected (either --execute or --prove)
    if args.execute == args.prove {
        eprintln!("❌ Error: You must specify either --execute or --prove");
        std::process::exit(1);
    }

    // Ensure the provided game score is valid
    if args.score == 0 {
        eprintln!("❌ Error: Game score must be greater than 0.");
        std::process::exit(1);
    }

    println!("🏆 Game Score: {}", args.score);

    // Initialize the ProverClient
    let client = ProverClient::from_env();

    // Store the final game score in the input stream
    let mut stdin = SP1Stdin::new();
    stdin.write(&args.score);

    if args.execute {
        // Execute the program in zkVM without generating a proof
        let (output, report) = client.execute(GAME_SCORE_ELF, &stdin).run().unwrap();
        println!("✅ Program executed successfully.");
        println!("🔄 Number of cycles executed: {}", report.total_instruction_count());
    } else {
        // Generate the proof for the given game score
        let (pk, vk) = client.setup(GAME_SCORE_ELF);
        let proof = client.prove(&pk, &stdin).run().expect("❌ Proof generation failed");

        println!("✅ Successfully generated proof!");

        // Verify the proof
        client.verify(&proof, &vk).expect("❌ Proof verification failed");
        println!("✅ Successfully verified proof!");

    }
}
