import "./App.styl";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Asset from "./Asset";
import Channel from "./Channel";
import { storeT, useEdiorStore } from "./store";
import { useCallback } from "react";
import { v4 } from "uuid";

function App() {
  const state = useEdiorStore();
  const onDragEnd = useCallback((props: DragEndEvent) => {
    console.log(props);
    if (props.over?.id === "channel-list" && props.active.data.current?.type === 'asset') {
      state.set((state: storeT) => {
        const assetId = props.active.data.current?.id
        const asset = state.assetList.find(item => item.id === assetId)
        if (!asset) {return state;}
        const { channelList: prevList } = state;
        prevList.push({
          id: v4(),
          clipList: [{
            id: v4(),
            assetId: assetId,
            name: asset.name,
            startTime: 0,
            endTime: asset.length,
            showRange: [0, asset.length],
          }]
        });
        return {
          channelList: prevList.filter(item => item.clipList.length !== 0),
        };
      });
    }
    if (props.over?.id === "channel-list" && props.active.data.current?.type === 'clip') {
      state.set((state: storeT) => {
        const clipId = props.active.data.current?.id
        const channelId = props.active.data.current?.channelId
        const assetId = props.active.data.current?.assetId
        const channel = state.channelList.find(item => item.id === channelId)
        console.log(channelId, state.channelList, channel)
        if (!channel || channel.clipList.length <= 1) {
          return state
        }
        const asset = state.assetList.find(item => item.id === assetId)
        const { channelList: prevList } = state;
        const nextList = prevList.map(item => {
          const nextItem = {
            ...item
          }
          nextItem.clipList = nextItem.clipList?.filter(item => item.id !== clipId)
          return nextItem
        })
        if (asset) {
          nextList.push({
            id: v4(),
            clipList: [{
              id: v4(),
              assetId: assetId,
              name: asset.name,
              startTime: 0,
              showRange: [0, asset.length],
              endTime: asset.length
            }]
          });
        }
        return {
          channelList: nextList.filter(item => item.clipList.length !== 0),
        };
      });
    }
    if (String(props.over?.id).includes("channel-item-") && props.active.data.current?.type === 'clip') {
      state.set((state: storeT) => {
        const clipId = props.active.data.current?.id
        const assetId = props.active.data.current?.assetId
        const asset = state.assetList.find(item => item.id === assetId)
        const { channelList: prevList } = state;
        const nextList = prevList.map(item => {
          const nextItem = {
            ...item
          }
          nextItem.clipList = nextItem.clipList?.filter(item => item.id !== clipId)
          return nextItem
        })
        if (asset) {
          const targetChannelId = String(props.over?.id).replace("channel-item-", "");
          const targetChannelIndex = nextList.findIndex(item => item.id === targetChannelId)
          if (nextList[targetChannelIndex]) {
            const startTime = Math.max(0, ...nextList[targetChannelIndex].clipList.map(item => item.endTime))
            console.log(startTime, nextList[targetChannelIndex].clipList)
            nextList[targetChannelIndex].clipList.push({
              id: v4(),
              assetId: assetId,
              name: asset.name,
              startTime: startTime,
              endTime: startTime + asset.length,
              showRange: [0, asset.length],
            })
          }
        }
        return {
          channelList: nextList.filter(item => item.clipList.length !== 0),
        };
      });
    }
  }, []);
  return (
    <DndContext onDragEnd={onDragEnd}>
      <Asset assetList={state.assetList} />
      <div className="main-frame">
        <div className="playback"></div>
        <Channel channelList={state.channelList} />
      </div>
    </DndContext>
  );
}

export default App;
