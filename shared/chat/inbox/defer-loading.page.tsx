import * as React from 'react'
import * as Common from '@/router-v2/common'
import * as Kb from '@/common-adapters'
import {HeaderNewChatButton} from './new-chat-button'

const Defer = React.lazy(async () => import('./defer-loading'))

const buttonWidth = 132
const getOptions = () => ({
  freezeOnBlur: false, // let it render even if not visible
  headerLeft: () => <Kb.HeaderLeftBlank />,
  headerLeftContainerStyle: {
    ...Common.defaultNavigationOptions.headerLeftContainerStyle,
    minWidth: buttonWidth,
    width: buttonWidth,
  },
  headerRight: () => <HeaderNewChatButton />,
  headerRightContainerStyle: {
    ...Common.defaultNavigationOptions.headerRightContainerStyle,
    minWidth: buttonWidth,
    paddingRight: 8,
    width: buttonWidth,
  },
  headerTitle: () => (
    <Kb.Text type="BodyBig" center={true}>
      Chats
    </Kb.Text>
  ),
})

const Screen = () => (
  <React.Suspense>
    <Defer />
  </React.Suspense>
)

const Page = {getOptions, getScreen: () => Screen}
export default Page
