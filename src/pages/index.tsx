import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Home() {
  return <>asdf</>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: "/project",
      permanent: false,
    },
  };
}
