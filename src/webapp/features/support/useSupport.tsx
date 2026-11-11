export function useSupport() {
  const openSupportChat = () => {
    window.open("https://www.linkedin.com/in/akashjadon", "_blank", "noopener,noreferrer");
  };

  return {
    openSupportChat,
  };
}
