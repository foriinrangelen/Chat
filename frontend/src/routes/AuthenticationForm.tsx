import { createFileRoute } from "@tanstack/react-router";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  type PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Alert,
  Container,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import { GoogleButton } from "@components/common/GoogleButton";
// import { TwitterButton } from "@components/common/TwitterButton";
import { KakaoButton } from "@/components/common/KakaoButton";
import { useLogin, useSignup } from "@hooks/useAuth";
import { AxiosError } from "axios";
import type { ApiError } from "@/types/auth";

export const Route = createFileRoute("/AuthenticationForm")({
  component: AuthenticationForm,
});

function AuthenticationForm(props: PaperProps) {
  // const [type, toggle] = useToggle(["login", "register"]);
  // const [type, toggle] = useToggle<"login" | "register">(["login", "register"]);
  // const [type, toggle] = useToggle(["로그인", "회원가입"]);
  const [type, toggle] = useToggle<"login" | "register">(["login", "register"]);

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const form = useForm({
    initialValues: {
      email: "",
      nickname: "",
      password: "",
      terms: true,
    },

    // 개발 중: 유효성 검사 비활성화
    // validate: {
    //   email: (val) =>
    //     /^\S+@\S+$/.test(val) ? null : "올바른 이메일을 입력하세요",
    //   nickname: (val) => {
    //     if (type === "register" && val.length < 1) {
    //       return "닉네임을 입력하세요";
    //     }
    //     if (type === "register" && val.length > 20) {
    //       return "닉네임은 20자 이하여야 합니다";
    //     }
    //     return null;
    //   },
    //   password: (val) => {
    //     if (val.length < 8) {
    //       return "비밀번호는 최소 8자 이상이어야 합니다";
    //     }
    //     if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/.test(val)) {
    //       return "비밀번호는 문자, 숫자, 특수문자를 포함해야 합니다";
    //     }
    //     return null;
    //   },
    //   terms: (val) => {
    //     if (type === "register" && !val) {
    //       return "이용약관에 동의해주세요";
    //     }
    //     return null;
    //   },
    // },
  });

  const handleSubmit = form.onSubmit((values) => {
    if (type === "login") {
      loginMutation.mutate({
        email: values.email,
        password: values.password,
      });
    } else {
      signupMutation.mutate({
        email: values.email,
        nickname: values.nickname,
        password: values.password,
      });
    }
  });

  const isLoading = loginMutation.isPending || signupMutation.isPending;
  const error = loginMutation.error || signupMutation.error;

  const getErrorMessage = (error: Error | null): string | null => {
    if (!error) return null;
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError | undefined;
      if (apiError?.message) {
        return Array.isArray(apiError.message)
          ? apiError.message.join(", ")
          : apiError.message;
      }
    }
    return "오류가 발생했습니다. 다시 시도해주세요.";
  };

  return (
    // <Center h="70vh">
    <Container>
      <Paper radius="md" p="lg" withBorder {...props}>
        <Text size="lg" fw={500}>
          <Box ta="center">{type === "login" ? "로그인" : "회원가입"}</Box>
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <KakaoButton radius="xl">Kakao</KakaoButton>
        </Group>

        <Divider
          label="또는 이메일로 계속하기"
          labelPosition="center"
          my="lg"
        />

        {error && (
          <Alert color="red" mb="md">
            {getErrorMessage(error)}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack>
            {type === "register" && (
              <TextInput
                label="닉네임"
                placeholder="닉네임을 입력하세요"
                value={form.values.nickname}
                onChange={(event) =>
                  form.setFieldValue("nickname", event.currentTarget.value)
                }
                error={form.errors.nickname}
                radius="md"
              />
            )}

            <TextInput
              required
              label="이메일"
              placeholder="example@email.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email}
              radius="md"
            />

            <PasswordInput
              required
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={form.errors.password}
              radius="md"
            />

            {type === "register" && (
              <Checkbox
                label="이용약관에 동의합니다"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
                error={form.errors.terms}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "이미 계정이 있으신가요? 로그인"
                : "계정이 없으신가요? 회원가입"}
            </Anchor>
            <Button type="submit" radius="xl" loading={isLoading}>
              {upperFirst(type === "login" ? "로그인" : "회원가입")}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
    // </Center>
  );
}
