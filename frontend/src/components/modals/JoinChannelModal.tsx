import {
  Modal,
  TextInput,
  Button,
  Stack,
  Group,
  Text,
  Paper,
  Avatar,
  Badge,
} from "@mantine/core";
import { useState } from "react";
import { HiArrowRightOnRectangle, HiMagnifyingGlass } from "react-icons/hi2";

// 검색 가능한 공개 채널 목록 (Mock)
const PUBLIC_CHANNELS = [
  {
    id: 101,
    name: "오픈소스 컨트리뷰터",
    icon: "오",
    description: "오픈소스 프로젝트에 기여하는 개발자들의 모임",
    memberCount: 156,
  },
  {
    id: 102,
    name: "취업 준비생 모임",
    icon: "취",
    description: "개발자 취업을 준비하는 분들을 위한 채널",
    memberCount: 89,
  },
  {
    id: 103,
    name: "알고리즘 스터디",
    icon: "알",
    description: "코딩 테스트 대비 알고리즘 문제 풀이",
    memberCount: 234,
  },
  {
    id: 104,
    name: "사이드 프로젝트",
    icon: "사",
    description: "함께 사이드 프로젝트를 진행할 팀원을 찾아요",
    memberCount: 67,
  },

  {
    id: 101,
    name: "오픈소스 컨트리뷰터",
    icon: "오",
    description: "오픈소스 프로젝트에 기여하는 개발자들의 모임",
    memberCount: 156,
  },
  {
    id: 101,
    name: "오픈소스 컨트리뷰터",
    icon: "오",
    description: "오픈소스 프로젝트에 기여하는 개발자들의 모임",
    memberCount: 156,
  },
];

interface JoinChannelModalProps {
  opened: boolean;
  onClose: () => void;
  onJoinChannel: (channelId: number) => void;
}

export function JoinChannelModal({
  opened,
  onClose,
  onJoinChannel,
}: JoinChannelModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "invite">("search");

  const filteredChannels = PUBLIC_CHANNELS.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = (channelId: number) => {
    onJoinChannel(channelId);
    handleClose();
  };

  const handleInviteJoin = () => {
    if (!inviteCode.trim()) return;
    // 실제로는 초대 코드 검증 API 호출
    alert(`초대 코드 "${inviteCode}"로 채널에 참가합니다.`);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setInviteCode("");
    setActiveTab("search");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <HiArrowRightOnRectangle size={20} style={{ color: "#228be6" }} />
          <Text fw={600}>채널 참가하기</Text>
        </Group>
      }
      centered
      size="md"
    >
      <Stack gap="md">
        {/* 탭 선택 */}
        <Group gap="xs">
          <Button
            variant={activeTab === "search" ? "filled" : "light"}
            size="xs"
            onClick={() => setActiveTab("search")}
          >
            채널 검색
          </Button>
          <Button
            variant={activeTab === "invite" ? "filled" : "light"}
            size="xs"
            onClick={() => setActiveTab("invite")}
          >
            초대 코드 입력
          </Button>
        </Group>

        {activeTab === "search" ? (
          <>
            {/* 검색창 */}
            <TextInput
              placeholder="채널 이름 또는 설명으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<HiMagnifyingGlass size={16} />}
            />

            {/* 검색 결과 */}
            <Stack gap="xs" style={{ maxHeight: 300, overflowY: "auto" }}>
              {filteredChannels.length > 0 ? (
                filteredChannels.map((channel) => (
                  <Paper key={channel.id} p="sm" withBorder radius="md">
                    <Group justify="space-between">
                      <Group gap="sm">
                        <Avatar color="blue" radius="md">
                          {channel.icon}
                        </Avatar>
                        <div>
                          <Group gap="xs">
                            <Text fw={600} size="sm">
                              {channel.name}
                            </Text>
                            <Badge size="xs" variant="light" color="gray">
                              {channel.memberCount}명
                            </Badge>
                          </Group>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {channel.description}
                          </Text>
                        </div>
                      </Group>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => handleJoin(channel.id)}
                      >
                        참가
                      </Button>
                    </Group>
                  </Paper>
                ))
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  검색 결과가 없습니다.
                </Text>
              )}
            </Stack>
          </>
        ) : (
          <>
            {/* 초대 코드 입력 */}
            <Text size="sm" c="dimmed">
              친구에게 받은 초대 코드를 입력하여 비공개 채널에 참가하세요.
            </Text>
            <TextInput
              placeholder="예: ABC123XYZ"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.currentTarget.value)}
              styles={{
                input: {
                  textAlign: "center",
                  fontSize: 18,
                  letterSpacing: 2,
                },
              }}
            />
            <Button
              fullWidth
              onClick={handleInviteJoin}
              disabled={!inviteCode.trim()}
            >
              참가하기
            </Button>
          </>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={handleClose}>
            닫기
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
