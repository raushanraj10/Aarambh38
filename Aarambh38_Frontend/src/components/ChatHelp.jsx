import React from "react";

const ChatHelpPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
            Aarambh38 – Chat Help
          </h1>
          <p className="text-gray-500 mt-2">
            Your quick guide to chatting, replying, and managing messages with ease.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-8 space-y-6">

          {/* Starting a Chat */}
          <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 text-blue-500 p-3 rounded-full text-lg">💬</div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-500">
                1. Starting a Chat
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                <li>
                  Click <strong>"Go to Chat"</strong> to open the chat window.
                </li>
                <li>
                  If you see a blank space, simply select a user from your contact list to begin chatting.
                </li>
              </ul>
            </div>
          </div>

          {/* Replying to a Message */}
          <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-green-100 text-green-500 p-3 rounded-full text-lg">↩️</div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-500">
                2. Replying to a Message
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                <li>
                  <strong>Desktop:</strong> Hover over a message, click the arrow icon, type your reply, and send.
                </li>
                <li>
                  <strong>Mobile:</strong> Tap the arrow icon directly to reply.
                </li>
              </ul>
            </div>
          </div>

          {/* Jump to Original Message */}
          <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-orange-100 text-orange-500 p-3 rounded-full text-lg">🖱️</div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-orange-500">
                3. Jump to Original Message
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                <li>
                  For replies, <strong>left-click</strong> the message to instantly navigate to its original.
                </li>
                <li>
                  The original message will be highlighted in a
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                    {" "}Blue Replied Bubble{" "}
                  </span>
                  for quick and clear reference.
                </li>
                <li>
                  This makes following conversation threads effortless.
                </li>
              </ul>
            </div>
          </div>

          {/* Deleting a Message */}
          <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-red-100 text-red-500 p-3 rounded-full text-lg">🗑️</div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-500">
                4. Deleting a Message
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                <li>
                  <strong>Desktop & Mobile:</strong> Right-click on a message and select <em>Delete</em>.
                </li>
                <li>
                  <strong>Warning:</strong> This is permanent—deleted messages cannot be recovered.
                </li>
                <li>
                  If a glitch occurs, you might lose important conversations—keep backups if needed.
                </li>
              </ul>
            </div>
          </div>

          {/* Deleting or Blocking a User */}
          <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-purple-100 text-purple-500 p-3 rounded-full text-lg">🚫</div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-purple-500">
                5. Deleting or Blocking a User
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                <li>
                  When you <strong>delete</strong> or <strong>block</strong> a user, all messages with them are erased automatically.
                </li>
                <li>
                  This action is <strong>irreversible</strong> — always back up important messages first.
                </li>
              </ul>
            </div>
          </div>

          {/* Prevent Accidental Deletion */}
          <div className="bg-white rounded-xl shadow-md p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-yellow-100 text-yellow-500 p-3 rounded-full text-lg">⚠️</div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-yellow-500">
                6. Prevent Accidental Deletion
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                <li>Always confirm before deleting a message.</li>
                <li>Avoid deleting during high network lag to prevent glitches.</li>
                <li>Back up critical chats regularly.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          💬 With{" "}
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-tight">
            Aarambh38
          </span>
          , chatting is simple, clear, and secure.
        </div>
      </div>
    </div>
  );
};

export default ChatHelpPage;
