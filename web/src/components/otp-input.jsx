import { useRef } from "react"

export function OtpInput({ value, onChange, length = 6 }) {
  const inputRefs = useRef([])

  const handleChange = (index, char) => {
    if (!/^[0-9]*$/.test(char)) return

    const newValue = value.split("")
    newValue[index] = char
    const result = newValue.join("").slice(0, length)
    onChange(result)

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?. focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length)
    onChange(paste)

    if (paste.length === length) {
      inputRefs.current[length - 1]?.focus()
    } else if (paste.length > 0) {
      inputRefs.current[Math.min(paste.length, length - 1)]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }). map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e. target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-semibold border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50 focus:bg-white transition-all"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}