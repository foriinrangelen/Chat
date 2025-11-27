import { Button, type ButtonProps } from "@mantine/core";

function KakaoIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path
        fill="#000000"
        d="M12 3C6.477 3 2 6.463 2 10.691c0 2.65 1.734 4.974 4.38 6.308-.143.522-.52 1.9-.596 2.194-.094.36.132.355.278.258.115-.076 1.828-1.238 2.57-1.742.44.062.89.094 1.368.094 5.523 0 10-3.463 10-7.112C20 6.463 15.523 3 12 3"
      />
    </svg>
  );
}

export function KakaoButton(
  props: ButtonProps & React.ComponentPropsWithoutRef<"button">
) {
  return (
    <Button
      leftSection={<KakaoIcon />}
      variant="filled"
      color="#FEE500"
      c="#000000"
      {...props}
    />
  );
}
