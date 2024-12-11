import { assetT } from "./store";
import { useDraggable } from "@dnd-kit/core";

const AssetItem = (props: { item: assetT }) => {
  const { item } = props;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `asset-item-${item.id}`,
    data: {
      type: "asset",
      id: item.id,
    },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <div
      key={item.id}
      className="asset-item"
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <img src={item.cover} alt={item.name} />
      <h3>{item.name}</h3>
    </div>
  );
};

const Asset = (props: { assetList: assetT[] }) => {
  return (
    <div className="asset">
      {props.assetList.map((item) => (
        <AssetItem item={item} key={item.id} />
      ))}
    </div>
  );
};

export default Asset;
