// src/hooks/useToast.js
export const useToast = () => {
  const showToast = (toast) => {
    const event = new CustomEvent('show-toast', { detail: toast })
    window.dispatchEvent(event)
  }

  return { showToast }
}