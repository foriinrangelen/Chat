import {
  Modal,
  TextInput,
  Button,
  Stack,
  Group,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { HiHashtag } from "react-icons/hi2";
import type { Channel } from "@/store/discord";

interface CreateWorkspaceModalProps {
  opened: boolean;
  onClose: () => void;
  channel: Channel;
  onCreateWorkspace: (name: string) => void;
}

export function CreateWorkspaceModal({
  opened,
  onClose,
  channel,
  onCreateWorkspace,
}: CreateWorkspaceModalProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // 유효성 검사
    if (!workspaceName.trim()) {
      setError("워크스페이스 이름을 입력해주세요.");
      return;
    }

    if (workspaceName.length > 30) {
      setError("워크스페이스 이름은 30자 이하로 입력해주세요.");
      return;
    }

    // 워크스페이스 생성
    onCreateWorkspace(workspaceName.trim());

    // 상태 초기화 및 모달 닫기
    setWorkspaceName("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setWorkspaceName("");
    setError("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <HiHashtag size={20} style={{ color: "#f97316" }} />
          <Text fw={600}>워크스페이스 만들기</Text>
        </Group>
      }
      centered
      size="sm"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          <Text span fw={600} c="blue">
            {channel.name}
          </Text>{" "}
          채널에 새 워크스페이스를 추가합니다.
        </Text>

        <TextInput
          label="워크스페이스 이름"
          placeholder="예: 자유게시판, 회의록"
          value={workspaceName}
          onChange={(e) => {
            setWorkspaceName(e.currentTarget.value);
            setError("");
          }}
          error={error}
          leftSection={<HiHashtag size={16} />}
          data-autofocus
        />

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!workspaceName.trim()}>
            만들기
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

