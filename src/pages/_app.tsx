import { type AppType } from "next/app";
import { Notifications } from "@mantine/notifications";
import "@/styles/globals.css";
import { createTheme, type DrawerProps, MantineProvider } from "@mantine/core";
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import AppLayout from "@/layouts/AppLayout";
import { SessionProvider } from "next-auth/react";
import router from "next/router";
import { useEffect } from "react";
import { ModalsProvider } from "@mantine/modals";

import '@mantine/charts/styles.css';
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";

const themeMantine = createTheme({
    fontFamily: "Noto Sans Thai",
    radius: {
        sm: "0.7rem",
    },
    components: {
        Drawer: {
            defaultProps: {
                offset: 10,
                radius: "md"
            } as DrawerProps,
        },
    }
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});

const MyApp: AppType = ({ Component, pageProps }) => {
    useEffect(() => {
        const handleRouteStart = () => nprogress.start();
        const handleRouteDone = () => nprogress.complete();

        router.events.on("routeChangeStart", handleRouteStart);
        router.events.on("routeChangeComplete", handleRouteDone);
        router.events.on("routeChangeError", handleRouteDone);

        return () => {
            router.events.off("routeChangeStart", handleRouteStart);
            router.events.off("routeChangeComplete", handleRouteDone);
            router.events.off("routeChangeError", handleRouteDone);
        };
    }, []);

    return (
        <>
            <Head>
                <title>BuildWise</title>
            </Head>
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    <MantineProvider theme={themeMantine}>
                        <ModalsProvider>
                            <NavigationProgress />
                            <Notifications position="top-right" />
                            <AppLayout>
                                <Component {...pageProps} />
                            </AppLayout>
                        </ModalsProvider>
                    </MantineProvider>
                </SessionProvider>
            </QueryClientProvider>
        </>
    );
};

export default MyApp;
