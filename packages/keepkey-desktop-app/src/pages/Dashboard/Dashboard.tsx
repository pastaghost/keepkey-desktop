import { Heading, Stack } from '@chakra-ui/react'
// import { FiatRamps } from 'components/Layout/Header/NavBar/FiatRamps'
import { Main } from 'components/Layout/Main'
import { DashboardSidebar } from './DashboardSidebar'
import { Portfolio } from './Portfolio'
import { Text } from 'components/Text'

export const Dashboard = () => {
  return (
    <Main
      titleComponent={
        <Stack pb={4}>
          <Heading>
            <Text translation='navBar.dashboard' />
          </Heading>
        </Stack>
      }
    >
      <Stack
        alignItems='flex-start'
        spacing={4}
        mx='auto'
        direction={{ base: 'column', xl: 'row' }}
      >
        <Stack spacing={4} flex='1 1 0%' width='full'>
          <Portfolio />
        </Stack>
        {/* <Stack flex='1 1 0%' width='full' maxWidth={{ base: 'full', xl: 'sm' }} spacing={4}>
          <DashboardSidebar />
        </Stack> */}
      </Stack>
    </Main>
  )
}
