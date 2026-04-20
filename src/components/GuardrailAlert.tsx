export function GuardrailAlert() {
  return (
    <div
      role="alert"
      className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-900"
    >
      <p className="font-semibold mb-1">This app doesn't generate assignment content.</p>
      <p>
        Use the <strong>Planning Notes</strong> to organize your ideas, or complete this week's{' '}
        <strong>Activity</strong> to apply the readings. Your assignments are written and submitted
        independently in Blackboard Ultra.
      </p>
    </div>
  )
}
