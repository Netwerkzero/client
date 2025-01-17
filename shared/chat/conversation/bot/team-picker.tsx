import * as C from '@/constants'
import * as React from 'react'
import * as Kb from '@/common-adapters'
import * as Styles from '@/styles'
import * as T from '@/constants/types'
import {Avatars, TeamAvatar} from '@/chat/avatars'
import debounce from 'lodash/debounce'
import logger from '@/logger'

type Props = {
  botUsername: string
}

const BotTeamPicker = (props: Props) => {
  const botUsername = props.botUsername
  const [term, setTerm] = React.useState('')
  const [results, setResults] = React.useState<Array<T.RPCChat.ConvSearchHit>>([])
  const [waiting, setWaiting] = React.useState(false)
  const [error, setError] = React.useState('')
  const submit = C.useRPC(T.RPCChat.localAddBotConvSearchRpcPromise)

  const [lastTerm, setLastTerm] = React.useState('init')
  if (lastTerm !== term) {
    setLastTerm(term)
    setWaiting(true)
    submit(
      [{term}],
      result => {
        setWaiting(false)
        setResults(result ?? [])
      },
      error => {
        setWaiting(false)
        setError('Something went wrong, please try again.')
        logger.info('BotTeamPicker: error loading search results: ' + error.message)
      }
    )
  }

  const clearModals = C.useRouterState(s => s.dispatch.clearModals)
  const onClose = () => {
    clearModals()
  }
  const navigateAppend = C.useRouterState(s => s.dispatch.navigateAppend)
  const onSelect = (convID: T.RPCChat.ConversationID) => {
    const conversationIDKey = T.Chat.conversationIDToKey(convID)
    navigateAppend({
      props: {botUsername, conversationIDKey},
      selected: 'chatInstallBot',
    })
  }

  const getFeaturedBots = C.useBotsState(s => s.dispatch.getFeaturedBots)
  C.useOnMountOnce(() => {
    getFeaturedBots()
  })

  const renderResult = (index: number, item: T.RPCChat.ConvSearchHit) => {
    return (
      <Kb.ClickableBox key={index} onClick={() => onSelect(item.convID)}>
        <Kb.Box2 direction="horizontal" fullWidth={true} gap="tiny" style={styles.results}>
          {item.isTeam ? (
            <TeamAvatar isHovered={false} isMuted={false} isSelected={false} teamname={item.name} />
          ) : (
            <Avatars participantOne={item.parts?.[0]} participantTwo={item.parts?.[1]} />
          )}
          <Kb.Text type="Body" style={{alignSelf: 'center'}}>
            {item.name}
          </Kb.Text>
        </Kb.Box2>
      </Kb.ClickableBox>
    )
  }
  return (
    <Kb.Modal
      onClose={onClose}
      header={{
        leftButton: Styles.isMobile ? (
          <Kb.Text type="BodyBigLink" onClick={onClose}>
            {'Cancel'}
          </Kb.Text>
        ) : undefined,
        title: 'Add to team or chat',
      }}
    >
      <Kb.Box2 direction="vertical" fullWidth={true}>
        <Kb.Box2 direction="horizontal" fullWidth={true}>
          <Kb.SearchFilter
            size="full-width"
            icon="iconfont-search"
            placeholderText={`Search chats and teams...`}
            placeholderCentered={true}
            onChange={debounce(setTerm, 200)}
            style={styles.searchFilter}
            focusOnMount={true}
            waiting={waiting}
          />
        </Kb.Box2>
        <Kb.Box2 direction="vertical" fullWidth={true} style={styles.container}>
          {error.length > 0 ? (
            <Kb.Text type="Body" style={{alignSelf: 'center', color: Styles.globalColors.redDark}}>
              {error}
            </Kb.Text>
          ) : (
            <Kb.List2
              indexAsKey={true}
              items={results}
              itemHeight={{sizeType: 'Large', type: 'fixedListItem2Auto'}}
              renderItem={renderResult}
            />
          )}
        </Kb.Box2>
      </Kb.Box2>
    </Kb.Modal>
  )
}

const styles = Styles.styleSheetCreate(
  () =>
    ({
      container: Styles.platformStyles({
        isElectron: {
          height: 450,
        },
      }),
      results: Styles.platformStyles({
        common: {
          paddingLeft: Styles.globalMargins.tiny,
          paddingRight: Styles.globalMargins.tiny,
        },
        isMobile: {
          paddingBottom: Styles.globalMargins.tiny,
        },
      }),
      searchFilter: Styles.platformStyles({
        common: {
          marginBottom: Styles.globalMargins.xsmall,
          marginTop: Styles.globalMargins.tiny,
        },
        isElectron: {
          marginLeft: Styles.globalMargins.small,
          marginRight: Styles.globalMargins.small,
        },
      }),
    }) as const
)

export default BotTeamPicker
