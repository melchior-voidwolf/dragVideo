import { channelT, clipT, useEdiorStore } from "./store";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";

const Clip = (props: {item: clipT, channelId: string}) => {
  const assetList = useEdiorStore(state => state.assetList);
  const {id, name, assetId, startTime, showRange} = props.item
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `clip-item-${id}`,
    data: {
      type: "clip",
      assetId: assetId,
      channelId: props.channelId,
      id: id,
    },
  });
  const size = showRange[1] - showRange[0]
  const asset = assetList.find(item => item.id === assetId)
  if (!asset) {
    return null;
  }
  return <div
  ref={setNodeRef}
  {...listeners}
  {...attributes}
  className="clip-item" style={{
    position: 'absolute',
    top: 5,
    left: startTime * 50,
    width: size * 50,
    background: `url(${asset.cover}) center left / contain`,
    zIndex: transform ? 1 : undefined,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)`: undefined,
  }}>
    <h3>{name}</h3>
  </div>
}

const ChannelItem = (props: { item: channelT }) => {
  const { item } = props;
  const { isOver, setNodeRef } = useDroppable({
    id: "channel-item-" + item.id,
  });
  const style = {
    backgroundColor: isOver ? "#383839" : undefined,
  };
  return (
    <div style={style} key={item.id} ref={setNodeRef} className="channel-item">
      {item.id}
      {
        item.clipList?.map(item => <Clip channelId={props.item.id} item={item} key={item.id} />   )
      }
    </div>
  );
};

const Channel = (props: { channelList: channelT[] }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "channel-list",
  });
  const style = {
    backgroundColor: isOver ? "#444" : undefined,
  };
  return (
    <div style={style} ref={setNodeRef} className="channel">
      {props.channelList.map((item) => (
        <ChannelItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Channel;
