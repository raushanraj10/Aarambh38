import React from "react";
import {
  ChatBubbleLeftEllipsisIcon,
  ArrowPathIcon,
  TrashIcon,
  UserMinusIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

// Feature definitions for the comparison table
const features = [
  {
    name: "Clear Chat",
    alumni: true,
    student: true,
    icon: ChatBubbleLeftEllipsisIcon,
    description: "Delete all messages in a conversation. This action cannot be undone.",
  },
  {
    name: "Remove Student",
    alumni: true,
    student: false,
    icon: UserMinusIcon,
    description: "Alumni can remove a student from their contacts. Deletes chat history.",
  },
  {
    name: "Block Student",
    alumni: true,
    student: false,
    icon: ExclamationTriangleIcon,
    description: "Alumni can block further conversations with a student.",
  },
  {
    name: "Delete Mentor",
    alumni: false,
    student: true,
    icon: UserMinusIcon,
    description: "Students can remove a mentor (Alumni) from contacts. Deletes chat history.",
  },
  {
    name: "Send Online Invite",
    alumni: true,
    student: false,
    icon: EnvelopeIcon, // could replace with a mail icon if you want
    description: "Alumni can send an email invitation asking students to come online.",
  },
  {
    name: "Help and Tips",
    alumni: true,
    student: true,
    icon: ArrowPathIcon,
    description: "View guidance and usage tips for the chat system.",
  },
];

// Detailed chat usage guide with steps
const chatGuideOptions = [
  {
    icon: ChatBubbleLeftEllipsisIcon,
    title: "Starting a Chat",
    steps: [
      <>Click <strong>"Go to Chat"</strong> to open the chat window.</>,
      <>If you see a blank space, simply select a user from your contact list to begin chatting.</>,
    ],
  },
  {
    icon: ArrowPathIcon,
    title: "Replying to a Message",
    steps: [
      <>
        <strong>Desktop:</strong> Right-click or left-click the arrow icon next to a message, type your reply, and send.
      </>,
      <>
        <strong>Mobile:</strong> Tap the arrow icon directly to reply.
      </>,
    ],
  },
  {
    icon: InformationCircleIcon,
    title: "Jump to Original Message",
    steps: [
      <>For replies, <strong>left-click</strong> the message to instantly navigate to its original.</>,
      <>
        The original message will be highlighted in a
        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 px-1">
          Blue Replied Bubble
        </span>
        for quick and clear reference.
      </>,
      <>This makes following conversation threads effortless.</>,
    ],
  },
  {
    icon: TrashIcon,
    title: "Deleting a Message",
    steps: [
      <>Right-click a message to select it, then multi-select messages for bulk delete (desktop & mobile).</>,
      <>Deleted messages cannot be recovered—delete carefully!</>,
      <>If there's a glitch, you may lose important conversations—keep backups if needed.</>,
    ],
  },
  {
    icon: UserMinusIcon,
    title: "Deleting or Blocking a User",
    steps: [
      <>
        When you <strong>delete</strong> or <strong>block</strong> a user, all messages with them are erased automatically.
      </>,
      <>This action is <strong>irreversible</strong>; always back up important messages first.</>,
    ],
  },
  {
    icon: ExclamationTriangleIcon,
    title: "Prevent Accidental Deletion",
    steps: [
      <>Always confirm before deleting a message.</>,
      <>Avoid deleting during high network lag.</>,
      <>Back up critical chats regularly.</>,
    ],
  },
];

const roleColors = {
  alumni: "bg-blue-50 border-blue-400",
  student: "bg-green-50 border-green-400",
};

const ChatInstructions = () => (
  <section className="mt-12 mb-14 bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 rounded-xl shadow-sm p-6 sm:p-8">
    <h2 className="text-2xl font-bold text-gray-900 text-center mb-7 px-2">
      <span className="inline-flex items-center gap-2">
        <InformationCircleIcon className="h-7 w-7 text-blue-600" /> Chat Usage Guide
      </span>
    </h2>
    <ul className="space-y-7 px-2 sm:px-6">
      {chatGuideOptions.map((item, idx) => {
        const Icon = item.icon;
        return (
          <li
            key={idx}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start border-b border-gray-100 pb-6 last:border-0 last:pb-0"
          >
            <Icon className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base leading-relaxed">
                {item.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  </section>
);

const ChatHelpPage = () => (
  <main className="bg-gray-50 min-h-screen py-10 px-4 sm:py-16 sm:px-8 md:px-12 lg:px-16">
    <div className="max-w-5xl mx-auto w-full">
      {/* Header */}
      <header className="mb-10 text-center px-2 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent mb-2 leading-tight">
          Aarambh38 Chat Help
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          Learn how to use the chat features—whether you are a{" "}
          <span className="font-semibold text-blue-700">Student</span> or{" "}
          <span className="font-semibold text-green-700">Alumni</span>.
        </p>
      </header>

      {/* Feature Comparison Table */}
      <section className="mb-14 overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-4 px-3 text-left text-sm sm:text-lg font-semibold text-gray-700">Feature</th>
              <th className="py-4 px-3 text-center text-sm sm:text-lg font-semibold text-blue-700 whitespace-nowrap">Alumni</th>
              <th className="py-4 px-3 text-center text-sm sm:text-lg font-semibold text-green-700 whitespace-nowrap">Student</th>
              <th className="py-4 px-3 text-left text-sm sm:text-lg font-semibold text-gray-700">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm sm:text-base">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <tr key={f.name} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-3 px-3 font-medium text-gray-900 flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
                    {f.name}
                  </td>
                  <td className={`py-3 px-3 text-center ${roleColors.alumni} whitespace-nowrap`}>
                    {f.alumni ? (
                      <span className="inline-block px-3 py-1 rounded-full text-blue-700 font-semibold bg-blue-100 border border-blue-400 select-none">
                        ✓
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className={`py-3 px-3 text-center ${roleColors.student} whitespace-nowrap`}>
                    {f.student ? (
                      <span className="inline-block px-3 py-1 rounded-full text-green-700 font-semibold bg-green-100 border border-green-400 select-none">
                        ✓
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3 px-3 text-gray-600">{f.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Chat Usage Guide Section */}
      <ChatInstructions />

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm sm:text-md text-gray-500 px-2 sm:px-6">
        <span className="font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Aarambh38
        </span>{" "}
        – Secure, seamless conversations for alumni and students.
      </footer>
    </div>
  </main>
);

export default ChatHelpPage;
