import { useState, useCallback, useRef, useEffect } from "react";
import ChatScreen from "./components/ChatScreen";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import useColorMode from "./hooks/useColorMode";
import { Chat } from "./types";
import useDebounce from "./hooks/useDebounce";

const { VITE_API_URL, VITE_OPENAI_KEY } = import.meta.env;

const Key = "replai-chats";

const previousChats: Chat[] =
	JSON.parse(localStorage.getItem(Key) as string) || [];

const App = () => {
	const { colorMode } = useColorMode(); // device theme context
	const [message, setMessage] = useState(""); // for storing input value
	const [chats, setChats] = useState<Chat[]>(previousChats); // for storing chats of both user and assistant
	const [generating, setGenerating] = useState(false); // for show loading while fetch

	const debouncedChats = useDebounce(JSON.stringify(chats)); // for saving in local-storage

	const controller = useRef<AbortController | null>(null); // to cancel the ongoing fectch stream

	const bg = colorMode === "dark" ? "bg-gray-950" : "bg-gray-100";

	// Fetch the response from the OpenAI API with the signal from AbortController
	const generateAIResponse = useCallback(async (content: string) => {
		setGenerating(true);
		controller.current = new AbortController();
		const signal = controller.current.signal;
		try {
			const response = await fetch(VITE_API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${VITE_OPENAI_KEY}`,
				},
				body: JSON.stringify({
					model: "gpt-3.5-turbo",
					messages: [{ role: "user", content }],
					stream: true,
				}),
				signal,
			});

			const reader = response.body?.getReader();

			const decoder = new TextDecoder("utf-8");
			let bag = "";
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const chunk = await reader?.read();
				if (chunk) {
					const { done, value } = chunk;

					if (done) {
						break;
					}

					const decodedValue = decoder.decode(value);
					const lines = decodedValue
						.split("\n")
						.map((line) => line.replace(/^data: /, "").trim())
						.filter((line) => line != "" && line != "[DONE]")
						.map((line) => JSON.parse(line));

					for (const line of lines) {
						const content = line.choices[0]?.delta.content;
						if (content) {
							if (bag === "") {
								bag += content;
								const newChat: Chat = {
									role: "assistant",
									content: bag,
									timestamp: Date.now(),
								};
								setChats((chats) => [...chats, newChat]);
							} else {
								bag += content;
								const newChat: Chat = {
									role: "assistant",
									content: bag,
									timestamp: Date.now(),
								};
								setChats((chats) => [...chats.slice(0, -1), newChat]);
							}
						}
					}
				} else {
					break;
				}
			}
		} catch (error) {
			if (signal.aborted) {
				alert(error);
			}
			setGenerating(false);
		} finally {
			setGenerating(false);
		}
	}, []);

	const aboart = useCallback(() => {
		if (controller.current) {
			controller.current.abort();
			controller.current = null;
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(Key, debouncedChats);
	}, [debouncedChats]);

	return (
		<div className={`${bg} flex flex-col h-[100vh] smooth`}>
			<Navbar />
			<ChatScreen chats={chats} />
			<SearchBar
				{...{
					message,
					setMessage,
					setChats,
					generateAIResponse,
					generating,
					aboart,
				}}
			/>
		</div>
	);
};

export default App;
