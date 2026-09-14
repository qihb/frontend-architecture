export function mockBusinessRequest(data, options = {}) {
  const { min = 200, max = 2000 } = options
  const delay = Math.floor(Math.random() * (max - min + 1)) + min

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        success: true,
        delay,
        requestId: `req_${Date.now()}`,
        data,
      })
    }, delay)
  })
}
