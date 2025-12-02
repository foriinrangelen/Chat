import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Text,
  Avatar,
  SimpleGrid,
  FileButton,
  Tabs,
  Paper,
  UnstyledButton,
  ScrollArea,
} from "@mantine/core";
import { useState } from "react";
import { HiHashtag, HiPhoto, HiSparkles } from "react-icons/hi2";
import {
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiRust,
  SiGo,
  SiSwift,
  SiKotlin,
  SiNodedotjs,
  SiNextdotjs,
  SiNestjs,
  SiDocker,
  SiSpring,
} from "react-icons/si";

// 프로그래밍 언어 아이콘 목록
const LANGUAGE_ICONS = [
  { id: "react", icon: SiReact, color: "#61DAFB", name: "React" },
  { id: "vue", icon: SiVuedotjs, color: "#4FC08D", name: "Vue" },
  { id: "angular", icon: SiAngular, color: "#DD0031", name: "Angular" },
  {
    id: "typescript",
    icon: SiTypescript,
    color: "#3178C6",
    name: "TypeScript",
  },
  {
    id: "javascript",
    icon: SiJavascript,
    color: "#F7DF1E",
    name: "JavaScript",
  },
  { id: "python", icon: SiPython, color: "#3776AB", name: "Python" },
  { id: "spring", icon: SiSpring, color: "#6DB33F", name: "Spring" },
  { id: "cpp", icon: SiCplusplus, color: "#00599C", name: "C++" },
  { id: "rust", icon: SiRust, color: "#000000", name: "Rust" },
  { id: "go", icon: SiGo, color: "#00ADD8", name: "Go" },
  { id: "swift", icon: SiSwift, color: "#FA7343", name: "Swift" },
  { id: "kotlin", icon: SiKotlin, color: "#7F52FF", name: "Kotlin" },
  { id: "nodejs", icon: SiNodedotjs, color: "#339933", name: "Node.js" },
  { id: "nextjs", icon: SiNextdotjs, color: "#000000", name: "Next.js" },
  { id: "nestjs", icon: SiNestjs, color: "#E0234E", name: "NestJS" },
  { id: "docker", icon: SiDocker, color: "#2496ED", name: "Docker" },
];

// 기본 색상 목록
const DEFAULT_COLORS = [
  "#228be6", // blue
  "#be4bdb", // grape
  "#12b886", // teal
  "#fd7e14", // orange
  "#e64980", // pink
  "#15aabf", // cyan
  "#fab005", // yellow
  "#40c057", // green
];

interface CreateChannelModalProps {
  opened: boolean;
  onClose: () => void;
  onCreateChannel: (channel: {
    name: string;
    description: string;
    icon: string;
    iconType: "initial" | "language" | "custom";
    iconColor?: string;
    customImage?: string;
  }) => void;
}

export function CreateChannelModal({
  opened,
  onClose,
  onCreateChannel,
}: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // 아이콘 선택 관련 상태
  const [iconType, setIconType] = useState<"initial" | "language" | "custom">(
    "initial"
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomImage(e.target?.result as string);
        setIconType("custom");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!channelName.trim()) {
      setError("채널 이름을 입력해주세요.");
      return;
    }

    if (channelName.length > 30) {
      setError("채널 이름은 30자 이하로 입력해주세요.");
      return;
    }

    let icon = channelName.trim()[0];
    let iconColor = selectedColor;

    if (iconType === "language" && selectedLanguage) {
      const lang = LANGUAGE_ICONS.find((l) => l.id === selectedLanguage);
      if (lang) {
        icon = selectedLanguage;
        iconColor = lang.color;
      }
    }

    onCreateChannel({
      name: channelName.trim(),
      description: description.trim(),
      icon,
      iconType,
      iconColor,
      customImage: customImage || undefined,
    });

    handleClose();
  };

  const handleClose = () => {
    setChannelName("");
    setDescription("");
    setError("");
    setIconType("initial");
    setSelectedLanguage(null);
    setSelectedColor(DEFAULT_COLORS[0]);
    setCustomImage(null);
    onClose();
  };

  const renderPreview = () => {
    if (iconType === "custom" && customImage) {
      return <Avatar src={customImage} size={60} radius="md" />;
    }
    if (iconType === "language" && selectedLanguage) {
      const lang = LANGUAGE_ICONS.find((l) => l.id === selectedLanguage);
      if (lang) {
        const Icon = lang.icon;
        return (
          <Avatar size={60} radius="md" color="gray">
            <Icon size={32} style={{ color: lang.color }} />
          </Avatar>
        );
      }
    }
    return (
      <Avatar size={60} radius="md" color={selectedColor}>
        <Text size="xl" fw={700}>
          {channelName.trim()[0] || "?"}
        </Text>
      </Avatar>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <HiHashtag size={20} style={{ color: "#f97316" }} />
          <Text fw={600}>채널 생성하기</Text>
        </Group>
      }
      centered
      size="md"
    >
      <Stack gap="md">
        {/* 미리보기 */}
        <Paper p="md" withBorder radius="md" bg="gray.0">
          <Group>
            {renderPreview()}
            <div>
              <Text fw={600} size="lg">
                {channelName || "채널 이름"}
              </Text>
              <Text size="sm" c="dimmed">
                {description || "채널 설명을 입력하세요"}
              </Text>
            </div>
          </Group>
        </Paper>

        {/* 채널 정보 입력 */}
        <TextInput
          label="채널 이름"
          placeholder="예: 프론트엔드 스터디"
          value={channelName}
          onChange={(e) => {
            setChannelName(e.currentTarget.value);
            setError("");
          }}
          error={error}
          required
        />

        <Textarea
          label="채널 설명"
          placeholder="이 채널에 대한 설명을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          rows={2}
        />

        {/* 아이콘 선택 */}
        <div>
          <Text size="sm" fw={500} mb="xs">
            채널 아이콘
          </Text>
          <Tabs
            value={iconType}
            onChange={(v) =>
              setIconType(v as "initial" | "language" | "custom")
            }
          >
            <Tabs.List>
              <Tabs.Tab value="initial" leftSection={<HiSparkles size={14} />}>
                기본
              </Tabs.Tab>
              <Tabs.Tab value="language" leftSection={<SiReact size={14} />}>
                언어/기술
              </Tabs.Tab>
              <Tabs.Tab value="custom" leftSection={<HiPhoto size={14} />}>
                직접 업로드
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="initial" pt="md">
              <Text size="xs" c="dimmed" mb="xs">
                색상을 선택하세요
              </Text>
              <Group gap="xs">
                {DEFAULT_COLORS.map((color) => (
                  <UnstyledButton
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: color,
                      border:
                        selectedColor === color
                          ? "3px solid #228be6"
                          : "2px solid transparent",
                    }}
                  />
                ))}
              </Group>
            </Tabs.Panel>

            <Tabs.Panel value="language" pt="md">
              <Text size="xs" c="dimmed" mb="xs">
                프로그래밍 언어/기술을 선택하세요
              </Text>
              <ScrollArea h={100} offsetScrollbars>
                <SimpleGrid cols={4} spacing="xs" pr="xs">
                  {LANGUAGE_ICONS.map((lang) => {
                    const Icon = lang.icon;
                    const isSelected = selectedLanguage === lang.id;
                    return (
                      <UnstyledButton
                        key={lang.id}
                        onClick={() => setSelectedLanguage(lang.id)}
                        style={{
                          padding: 8,
                          borderRadius: 8,
                          border: isSelected
                            ? "2px solid #228be6"
                            : "1px solid #dee2e6",
                          backgroundColor: isSelected
                            ? "#e7f5ff"
                            : "transparent",
                          textAlign: "center",
                        }}
                      >
                        <Stack gap={4} align="center">
                          <Icon size={24} style={{ color: lang.color }} />
                          <Text size="xs" c="dimmed">
                            {lang.name}
                          </Text>
                        </Stack>
                      </UnstyledButton>
                    );
                  })}
                </SimpleGrid>
              </ScrollArea>
            </Tabs.Panel>

            <Tabs.Panel value="custom" pt="md">
              <Stack align="center" gap="md">
                {customImage ? (
                  <Avatar src={customImage} size={80} radius="md" />
                ) : (
                  <Avatar size={80} radius="md" color="gray">
                    <HiPhoto size={32} />
                  </Avatar>
                )}
                <FileButton onChange={handleFileChange} accept="image/*">
                  {(props) => (
                    <Button variant="light" {...props}>
                      이미지 선택
                    </Button>
                  )}
                </FileButton>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </div>

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!channelName.trim()}>
            채널 생성
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
