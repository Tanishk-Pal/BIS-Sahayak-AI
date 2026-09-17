import { useRef, useState } from "react";
import {
  ArrowUp,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  function handleSend() {
    const text = input.trim();

    if (!text && !selectedFile) return;

    onSend({
      text,
      file: selectedFile,
    });

    setInput("");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
  }

  function removeFile() {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function getFileIcon() {
    if (selectedFile?.type.startsWith("image/")) {
      return <ImageIcon size={18} />;
    }

    return <FileText size={18} />;
  }

  return (
    <div className="chat-input-area">
      {selectedFile && (
        <div className="selected-file">
          <div className="selected-file-info">
            {getFileIcon()}

            <span title={selectedFile.name}>
              {selectedFile.name}
            </span>
          </div>

          <button
            type="button"
            className="remove-file-button"
            onClick={removeFile}
            title="Remove attachment"
            aria-label="Remove attachment"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="chat-input-wrapper">
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="attachment-button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach file"
          aria-label="Attach file"
        >
          <Paperclip size={21} />
        </button>

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message BIS Sahayak AI..."
          rows="1"
          aria-label="Message BIS Sahayak AI"
        />

        <button
          type="button"
          className="send-button"
          onClick={handleSend}
          disabled={!input.trim() && !selectedFile}
          title="Send message"
          aria-label="Send message"
        >
          <ArrowUp size={20} />
        </button>
      </div>

      <p className="input-disclaimer">
        BIS Sahayak AI can make mistakes. Verify important information with
        official BIS sources.
      </p>
    </div>
  );
}

export default ChatInput;