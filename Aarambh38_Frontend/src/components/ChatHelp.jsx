import React from "react";
import {
  ChatBubbleLeftEllipsisIcon,
  ArrowPathIcon,
  CursorArrowRippleIcon,
  TrashIcon,
  UserMinusIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const iconComponents = [
  ChatBubbleLeftEllipsisIcon,
  ArrowPathIcon,
  CursorArrowRippleIcon,
  TrashIcon,
  UserMinusIcon,
  ExclamationTriangleIcon,
];

const ChatHelpPage = () => (
  <main className="bg-gray-50 min-h-screen py-20 px-6">
    <div className="max-w-3xl mx-auto prose prose-gray">
      {/* Header */}
      <header className="mb-14 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent tracking-tight leading-tight">
          Aarambh38 – Chat Help
        </h1>
        <p className="mt-4 text-lg leading-relaxed max-w-lg mx-auto text-gray-700">
          Your quick guide to chatting, replying, and managing messages with ease.
        </p>
      </header>

      {/* Steps Section */}
      <section className="space-y-10">
        {[
          {
            title: "Starting a Chat",
            steps: [
              <>Click <strong>“Go to Chat”</strong> to open the chat window.</>,
              <>If you see a blank space, select a user from your contact list to begin chatting.</>,
            ],
          },
          {
            title: "Replying to a Message",
            steps: [
              <>On desktop: Hover over a message, click the arrow icon, type your reply, and send.</>,
              <>On mobile: Tap the arrow icon directly to reply.</>,
            ],
          },
          {
            title: "Jump to Original Message",
            steps: [
              <>For replies, <strong>left-click</strong> the message to navigate to its original.</>,
              <>The original message will be highlighted for quick reference.</>,
              <>This makes following conversation threads effortless.</>,
            ],
          },
          {
            title: "Deleting a Message",
            steps: [
              <>
                Right-click a message to select it, then use right-click + tap on other messages to multi-select for bulk delete (desktop & mobile).
              </>,
              <>This is permanent—deleted messages cannot be recovered.</>,
              <>If there’s a glitch, you might lose important conversations—keep backups if needed.</>,
            ],
          },
          {
            title: "Deleting or Blocking a User",
            steps: [
              <>When you <strong>delete</strong> or <strong>block</strong> a user, all messages with them are erased automatically.</>,
              <>This action is <strong>irreversible</strong>; always back up important messages first.</>,
            ],
          },
          {
            title: "Prevent Accidental Deletion",
            steps: [
              <>Always confirm before deleting a message.</>,
              <>Avoid deleting during high network lag.</>,
              <>Back up critical chats regularly.</>,
            ],
          },
        ].map((section, idx) => {
          const Icon = iconComponents[idx];
          return (
            <article
              key={section.title}
              className="flex items-start gap-5 bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Icon
                className="w-7 h-7 text-gray-500 mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 tracking-tight">
                  Step {idx + 1}: {section.title}
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-base leading-relaxed">
                  {section.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
        💬 With{" "}
        <span className="font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent px-1">
          Aarambh38
        </span>
        , chatting is simple, clear, and secure.
      </footer>
    </div>
  </main>
);

export default ChatHelpPage;