import React from 'react'
import p from 'prefix-classname'
import { useDragDropManager } from 'react-dnd'
import {
  CLS_PREFIX,
  useOveringNode,
  useSelectedNode,
  overingNodeSubject,
  selectedNodeSubject
} from '../../../config/const'
import { addModules } from '../../utils/externals-modules'
// @ts-ignore
import createApi from './client-api'
import { useSharedMap, useSharedUpdateMap, SharedProvider, useShared, useSharedProvider } from '@rcp/use.shared'

const Dnd = require('react-dnd')

const cn = p('')
const c = p(`${CLS_PREFIX}-stage`)

import './style.scss'

import { headerStatusSubject, useHeaderStatus } from '../header'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

export interface StageProps {
  className?: string
  bundlerURL?: string
  apiBaseURL?: string
  externalModules?: Record<string, any>
}

const StageContent: React.FC<StageProps> = React.memo(({ className, externalModules, bundlerURL, apiBaseURL }) => {
  React.useLayoutEffect(() => !!externalModules && addModules(externalModules), [externalModules])

  const ddManager = useDragDropManager()
  const _sharedMap = useSharedMap()
  const _sharedUpdateMap = useSharedUpdateMap()
  React.useLayoutEffect(
    () =>
      addModules({
        shared: {
          api: createApi(apiBaseURL),

          // value shared
          useShared,
          overingNodeSubject,
          selectedNodeSubject,
          useOveringNode,
          useSelectedNode,
          useHeaderStatus,
          headerStatusSubject,
          RootProvider: (props) => {
            return (
              <SharedProvider _internal={{ valuesMap: _sharedMap, updateMap: _sharedUpdateMap }}>
                <ConfigProvider locale={zhCN}>
                  <Dnd.DndProvider {...props} manager={ddManager} />
                </ConfigProvider>
              </SharedProvider>
            )
          }
        }
      }),
    [ddManager, _sharedMap, _sharedUpdateMap, apiBaseURL]
  )

  return (
    <div className={cn(c(), className)}>
      <iframe src={bundlerURL} className={c('__iframe')} />
    </div>
  )
})

const Stage = (props) => {
  return <StageContent {...props} />
}

Stage.defaultProps = {
  bundlerURL: '/bundler.html',
  apiBaseURL: 'http://localhost:8686/'
}

export default Stage
