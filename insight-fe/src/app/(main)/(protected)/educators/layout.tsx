import { ContentGrid } from "@/components/ContentGrid";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Flex, Grid, Text } from "@chakra-ui/react";

interface EducatorsLayoutProps {
  children: React.ReactNode;
}

export default function EducatorsLayout({ children }: EducatorsLayoutProps) {
  return (
    <PageContainer>
      <Topbar>
        <Text>Topbar</Text>
      </Topbar>
      <ContentGrid flex="1" width="100%" templateColumns="1fr">
        <ContentContainer>{children}</ContentContainer>
      </ContentGrid>
    </PageContainer>
  );
}
