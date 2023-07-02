import {
	Dispatch,
	SetStateAction,
	useCallback,
	KeyboardEvent,
	useEffect,
} from "react";
import useColorMode from "../hooks/useColorMode";
import { TbMicrophone, TbSend, TbHandStop } from "react-icons/tb";
import { Chat } from "../types";
import { SyncLoader } from "react-spinners";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import useDebounce from "../hooks/useDebounce";

interface Props {
	message: string;
	setMessage: Dispatch<SetStateAction<string>>;
	setChats: Dispatch<SetStateAction<Chat[]>>;
	generateAIResponse: (propmt: string) => void;
	generating: boolean;
	aboart: () => void;
}

const SearchBar = ({
	message,
	setMessage,
	setChats,
	generateAIResponse,
	generating,
	aboart,
}: Props) => {
	const { colorMode } = useColorMode();
	const text = colorMode === "dark" ? "text-gray-200" : "text-gray-950";
	const { transcript, listening } = useSpeechRecognition();

	const debouncedScript = useDebounce(transcript);

	const handleSendMessage = useCallback(
		(message: string) => {
			console.log("called");
			const content = message.trim();
			if (content.length > 2) {
				setChats((chats) => {
					generateAIResponse(message);
					return [...chats, { role: "user", content, timestamp: Date.now() }];
				});
				setMessage("");
				SpeechRecognition.stopListening();
			}
		},
		[setChats, setMessage, generateAIResponse],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			const message = e.currentTarget.value;
			if (e.shiftKey && e.code === "Enter") {
				console.log("Shift and Enter");
			} else {
				if (e.code === "Enter") {
					handleSendMessage(message);
				}
			}
		},
		[handleSendMessage],
	);

	const listen = useCallback(() => {
		SpeechRecognition.startListening({ language: "en-IN" });
	}, []);

	const stopListening = useCallback(() => {
		SpeechRecognition.startListening();
	}, []);

	useEffect(() => {
		setMessage(transcript);
	}, [transcript, setMessage]);

	useEffect(() => {
		if (debouncedScript !== "" && !listening) {
			handleSendMessage(debouncedScript);
		}
	}, [debouncedScript, listening, handleSendMessage]);

	return (
		<div
			className={`flex m-5 p-1 flex-row border border-gray-300 items-center text-lg gap-2 rounded-full overflow-hidden shadow-md  ${text}`}>
			<input
				className="flex-1 bg-transparent p-2 tracking-wide focus:outline-none"
				type="text"
				multiple
				value={message}
				placeholder={generating ? "Generating..." : "Send a message"}
				onChange={({ target }) => setMessage(target.value)}
				onKeyDown={handleKeyDown}
			/>
			{(listening || generating) && (
				<SyncLoader
					size={6}
					color={colorMode === "dark" ? "rgb(229 231 235)" : "rgb(3 7 18)"}
				/>
			)}
			{generating && (
				<div
					onClick={aboart}
					className={`${text} search-bar-icon text-red-600`}>
					<TbHandStop />
				</div>
			)}

			<div
				onClick={() => {
					handleSendMessage(message);
				}}
				className={`${text} search-bar-icon`}>
				<TbSend />
			</div>
			<div
				onClick={listening ? stopListening : listen}
				className={`${text} search-bar-icon ${listening && "listening"}`}>
				<TbMicrophone />
			</div>
		</div>
	);
};

export default SearchBar;
