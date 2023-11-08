import { useState } from "react";
import List from "./index";
import ListGroup from "../ListGroup";
import ListItem from "../ListItem";
import Icon from "../Icon";

const BtnItem = ({
  onClick,
  icon,
  text,
  className = "",
}: {
  onClick?: () => void;
  icon: string;
  text: string;
  className?: string;
}) => {
  return (
    <ListItem className={className} onClick={onClick}>
      <SideBarItem icon={icon} text={text} />
    </ListItem>
  );
};
const LinkItem = ({
  href,
  icon,
  text,
  className = "",
}: {
  href: string;
  icon: string;
  text: string;
  className?: string;
}) => {
  return (
    <ListItem className={className} href={href}>
      <SideBarItem icon={icon} text={text} />
    </ListItem>
  );
};
const GroupItem = ({
  id,
  open,
  text,
  icon,
  items,
  setItems,
  className = "",
}: {
  id: number;
  open: boolean;
  text: string;
  icon: string;
  items: any[];
  setItems: any;
  className?: string;
}) => {
  return (
    <ListGroup
      className={className}
      itemsClass="my-3 ps-6"
      disabled={false}
      open={open}
      toggleOpen={() => {
        setItems((old: any) => {
          return old.map((oldItem: any) => {
            if (oldItem.id !== id) return oldItem;
            return { ...oldItem, open: !oldItem.open };
          });
        });
      }}
      activatorJsx={(isOpen: boolean) => <BtnItem text={text} icon={icon} />}
    >
      {items?.map((item) => {
        return (
          <div key={item.id}>
            {item.type === "btn" && (
              <BtnItem
                className={className}
                text={item.text}
                icon={item.icon}
                onClick={item.onClick!}
              />
            )}
            {item.type === "link" && (
              <LinkItem
                className={className}
                text={item.text}
                href={item.href!}
                icon={item.icon}
              />
            )}
          </div>
        );
      })}
    </ListGroup>
  );
};
const SideBarItem = ({ icon, text }: { icon: string; text: string }) => {
  return (
    <div className="flex items-center">
      <Icon icon={icon} size="sm" color="slate-500" />
      <p className="ms-4 text-body1 text-slate-500">{text}</p>
    </div>
  );
};
export default function Example() {
  const [sidebarItems, setSidebarItems] = useState([
    {
      id: 1,
      type: "link",
      href: "/dashboard",
      icon: "mdi:account",
      text: "item-1",
    },
    {
      id: 2,
      type: "btn",
      onClick: () => {},
      icon: "mdi:chart",
      text: "item-2",
    },
    {
      id: 3,
      type: "group",
      open: false,
      icon: "mdi:plus",
      text: "item-3",
      items: [
        {
          id: 1,
          type: "link",
          href: "/dashboard",
          icon: "mdi:home",
          text: "inner-item-1",
        },
        {
          id: 2,
          type: "btn",
          onClick: () => {},
          icon: "mdi:table",
          text: "inner-item-2",
        },
      ],
    },
  ]); //because we want to be able to change isOpen of list groups we need state
  return (
    <div>
      <List className="m-10 w-[300px] border border-solid border-slate-300 p-2">
        {sidebarItems.map((sidebarItem: any) => {
          return (
            <div key={sidebarItem.id}>
              {sidebarItem.type === "btn" && (
                <BtnItem
                  text={sidebarItem.text}
                  icon={sidebarItem.icon}
                  onClick={sidebarItem.onClick!}
                  className="my-3"
                />
              )}
              {sidebarItem.type === "link" && (
                <LinkItem
                  text={sidebarItem.text}
                  href={sidebarItem.href!}
                  icon={sidebarItem.icon}
                  className="my-3"
                />
              )}
              {sidebarItem.type === "group" && (
                <GroupItem
                  open={sidebarItem.open!}
                  setItems={setSidebarItems}
                  id={sidebarItem.id}
                  text={sidebarItem.text}
                  icon={sidebarItem.icon}
                  items={sidebarItem.items!}
                  className="my-3"
                />
              )}
            </div>
          );
        })}
      </List>
    </div>
  );
}
