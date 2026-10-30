type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const installEvent = shallowRef<InstallPromptEvent | null>(null)
const isStandalone = ref(false)
let isListening = false

type PwaWindow = Window & { __pwaInstallPrompt?: InstallPromptEvent | null }

function detectStandalone() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }

  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches
    || navigatorWithStandalone.standalone === true
}

function startListening() {
  if (isListening) {
    return
  }

  isListening = true
  detectStandalone()

  const pwaWindow = window as PwaWindow

  if (pwaWindow.__pwaInstallPrompt) {
    installEvent.value = pwaWindow.__pwaInstallPrompt
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    pwaWindow.__pwaInstallPrompt = event as InstallPromptEvent
    installEvent.value = event as InstallPromptEvent
  })

  window.addEventListener('appinstalled', () => {
    pwaWindow.__pwaInstallPrompt = null
    installEvent.value = null
    isStandalone.value = true
  })
}

if (import.meta.client) {
  startListening()
}

export function usePwaInstall() {
  const hasPrompt = computed(() => installEvent.value !== null)

  async function install(): Promise<boolean> {
    const event = installEvent.value

    if (!event) {
      return false
    }

    await event.prompt()
    const choice = await event.userChoice
    installEvent.value = null

    return choice.outcome === 'accepted'
  }

  return {
    hasPrompt,
    isInstalled: readonly(isStandalone),
    install
  }
}
