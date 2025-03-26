import { Alert, Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import { useRef } from "react";

export default function SignIn(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-3">
      <form
        method="post"
        action="/api/auth/callback/credentials"
        className="flex w-full flex-col gap-3"
      >
        <Text size="xl" fw={700}>
          Build Wise
        </Text>
        {props.error && (
          <Alert
            variant="light"
            color="red"
            title="เกิดข้อผิดพลาด"
            icon={<IconInfoCircle />}
          >
            {props.error}
          </Alert>
        )}

        <input name="csrfToken" type="hidden" defaultValue={props.csrfToken} />
        <TextInput
          ref={username}
          label="Username"
          name="username"
          defaultValue={"new_user"}
          placeholder="Username"
        />
        <PasswordInput
          ref={password}
          name="password"
          label="Password"
          defaultValue={"secure_password"}
          placeholder="Password"
        />
        <Button type="submit">Sign In</Button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      error: context.query.error ?? null,
    },
  };
}
