# Succinct Crab Game

## Introduction

**Succinct Crab Game** is a simple game inspired by the classic Snake game. Players control a crab, navigating the game area to collect points while avoiding obstacles and boundaries.

This project integrates **Succinct's SP1** proving system, allowing players to generate cryptographic proofs of their scores. After finishing a game, users can click the **"Generate Proof (SP1)"** button to create a proof that verifies their final score. The proof is generated using the **SP1 proving system** through the `server.js` API.

---

## Folder Structure

Succinct-Crab-Game/
│── web/ # Frontend (HTML, JS, CSS) - Game UI and interaction
│ ├── index.html # Main game interface
│ ├── script.js # Game logic
│ ├── style.css # Game styles
│
│── server/ # Backend (Node.js) - Handles SP1 proof generation
│ ├── server.js # API server for proof generation
│ ├── package.json # Node.js dependencies
│ ├── package-lock.json
│
│── contracts/ # Smart contracts for score verification
│ ├── lib/  
│ │ ├── sp1-contracts/
│ │ │ ├── ISP1Verifier.sol # SP1 Verifier Contract
│ ├── src/
│ │ ├── GameScoreRecorder.sol # Contract for recording game scores
│
│── script/ # SP1 Proof Generation Scripts
│ ├── Cargo.toml # Rust dependencies
│ ├── build.rs # Build configuration
│ ├── src/bin/
│ │ ├── main.rs # Main script for generating SP1 proofs
│
│── program/ # SP1 Program - Proof computation logic
│ ├── Cargo.toml # Rust dependencies for the program
│ ├── src/
│ │ ├── main.rs # Proof logic
│
│── assets/ # Game assets
│ ├── Succinct_crab.png
│ ├── Succinct_logo.svg
│ ├── fonts/
│ │ ├── ABCOracleVariable-Trial.ttf
│
│── README.md # Project documentation
│── Cargo.toml # Rust workspace configuration
│── Cargo.lock # Rust dependency lock file
│── .gitignore # Git ignore file

### Key Components:

- **web/** - The frontend UI using HTML, JavaScript, and CSS.
- **server/** - Node.js backend that provides APIs for score proof generation.
- **contracts/** - Solidity smart contracts for on-chain score verification.
- **script/** - Rust scripts for generating SP1 proofs.
- **program/** - Rust-based proof computation logic for the game.
- **assets/** - Images, fonts, and other game-related resources.

---

## Execution Guide

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **Rust & Cargo** (for SP1 proving)
- **SP1 Toolchain** (`sp1up` installed)

### Setup & Installation

1. **Clone the repository**:

   ```
   git clone https://github.com/your-repo/Succinct-Crab-Game.git
   cd Succinct-Crab-Game
   ```

2. **Install dependencies**:

   ```
   cd server
   npm install  # Or use yarn install
   ```

3. **Run the backend server**:

   ```
   cd server
   node server.js
   ```

4. **Start the frontend**:

double click 'index.html' file

5. **Build the program**:

   ```
   cd program
   cargo prove build
   ```

6. **Generate SP1 Proof (After a game session ends)**:

- Click the "Generate Proof (SP1)" button.
- The frontend calls the backend API (server.js), which utilizes SP1 to generate a cryptographic proof of the final score.

## Additional Notes

- Troubleshooting SP1 Issues: If you encounter Rust version errors, dependency conflicts, or proof verification issues, refer to the Succinct Troubleshooting Guide.
- SP1 Proving System: The proof is generated using Succinct's zkVM to verify the game score cryptographically.
- Proof Verification: The game score proof can be verified off-chain using Succinct’s zkVM or on-chain if integrated with a smart contract.

## License

This project is open-source and available under the MIT License.

```

```
