import { useEffect, useRef } from "react";

import { Chat } from "../types";

interface Props {
	chats: Chat[];
	onClick?: () => void;
}

const ChatScreen = ({ chats }: Props) => {
	const lastMessageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (lastMessageRef.current) {
			lastMessageRef.current.scrollIntoView();
		}
	}, [chats, lastMessageRef]);

	return (
		<div className="flex-1 flex overflow-y-scroll hide-scrollbar">
			<div className="w-full flex flex-col p-1">
				{chats.map(({ role, content, timestamp }, index) => (
					<div
						ref={index === chats.length - 1 ? lastMessageRef : null}
						key={timestamp}
						className={`${
							role === "assistant"
								? "self-start rounded-bl-none text-start bg-blue-200"
								: "self-end rounded-br-none text-end bg-gray-200"
						} max-w-[90%] break-words rounded-xl py-2 px-3 my-5`}>
						{content.split("\n").map((message, index) => (
							<div
								className="min-h-[10px] text-lg"
								key={timestamp + message + index}>
								{message}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default ChatScreen;
