use sp1_sdk::{ProverClient, SP1Stdin, include_elf};

/// 프로그램 ELF 파일을 포함합니다.
/// 실제 파일명은 프로젝트 빌드 시 생성된 ELF 파일 경로로 대체합니다.
const GAME_SCORE_ELF: &[u8] = include_elf!("snake-game-program");

fn main() {
    // 로그 설정 (선택 사항)
    sp1_sdk::utils::setup_logger();

    // 게임에서 전달받은 최종 점수를 입력 스트림에 기록합니다.
    // 실제 게임에서는 UI 또는 다른 방식으로 점수를 전달받아 이 부분에 반영하면 됩니다.
    let final_score: u32 = 12345; // 예시 점수, 실제 게임 로직에 따라 동적으로 결정

    let mut stdin = SP1Stdin::new();
    stdin.write(&final_score);

    // sp1 ProverClient를 환경 변수에서 초기화합니다.
    let client = ProverClient::from_env();

    // 프로그램(ELF)를 위한 proving key(pk)와 verifying key(vk)를 설정합니다.
    let (pk, vk) = client.setup(GAME_SCORE_ELF);

    // 증명을 생성합니다. (여기서는 Groth16 증명 방식을 예로 들었습니다)
    let proof = client.prove(&pk, &stdin).groth16().run().unwrap();

    // 증명 검증 (선택 사항)
    client.verify(&proof, &vk).expect("증명 검증 실패");

    // 생성된 증명을 파일로 저장하거나 온체인에 전송하기 위한 처리를 진행합니다.
    proof.save("game_score_proof.bin").expect("증명 저장 실패");

    println!("게임 점수 증명이 성공적으로 생성되었습니다!");
}
