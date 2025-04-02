import { ContentGrid } from "@/components/ContentGrid";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Grid, Text } from "@chakra-ui/react";

interface AdministrationLayoutProps {
  children: React.ReactNode;
}

export default function AdministrationLayout({
  children,
}: AdministrationLayoutProps) {
  return (
    <PageContainer>
      <Topbar>
        <Text>Topbar</Text>
      </Topbar>
      <ContentGrid flex="1" width="100%" templateColumns="200px 1fr">
        <Sidebar />
        <ContentContainer>{children}</ContentContainer>
      </ContentGrid>
    </PageContainer>
  );
}
