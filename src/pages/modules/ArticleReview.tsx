import { useSession } from '../../context/SessionContext'
import { useNotes } from '../../hooks/useNotes'
import { NoteField } from '../../components/NoteField'
import { SaveIndicator } from '../../components/SaveIndicator'
import { generatePDF } from '../../utils/pdf'

const ARTICLE_FIELDS = [
  { key: 'citation', label: 'Full Citation (APA or as assigned)', placeholder: 'Author(s), Year, Title, Journal, Volume(Issue), Pages.' },
  { key: 'purpose', label: 'Purpose of the Study', placeholder: 'What was the study trying to find out?' },
  { key: 'methods', label: 'Methods Used', placeholder: 'How did the researchers collect and analyze data?' },
  { key: 'findings', label: 'Key Findings', placeholder: 'What did the study find?' },
  { key: 'policy_implications', label: 'Policy Implications', placeholder: 'What do these findings mean for health policy?' },
  { key: 'reflection', label: 'Your Reflection', placeholder: 'How does this article connect to your health issue?' },
]

function ArticleSection({ index, notes, update }: { index: number; notes: Record<string, string>; update: (k: string, v: string) => void }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-200">
        Article {index + 1}
      </h2>
      {ARTICLE_FIELDS.map(f => {
        const key = `a${index}_${f.key}`
        return (
          <NoteField
            key={key}
            label={f.label}
            fieldKey={key}
            value={notes[key] ?? ''}
            onChange={update}
            placeholder={f.placeholder}
          />
        )
      })}
    </div>
  )
}

export function ArticleReview() {
  const { session } = useSession()
  const { notes, update, savedAt } = useNotes('article_review')

  const handleExport = () => {
    const sections: { heading: string; content: string }[] = []
    for (let i = 0; i < 3; i++) {
      sections.push({ heading: `Article ${i + 1}`, content: '' })
      ARTICLE_FIELDS.forEach(f => {
        const key = `a${i}_${f.key}`
        sections.push({ heading: f.label, content: notes[key] ?? '' })
      })
    }
    generatePDF('article_review', session?.studentName ?? '', session?.section ?? '', sections)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-1">Article Research Notes</h1>
      <p className="text-sm text-slate-500 mb-6">
        Organize your notes for three scholarly articles. These notes support your Article Review
        assignment — they are not the assignment itself.
      </p>

      {[0, 1, 2].map(i => (
        <ArticleSection key={i} index={i} notes={notes} update={update} />
      ))}

      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={handleExport}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Export PDF
        </button>
        <SaveIndicator savedAt={savedAt} />
      </div>
    </div>
  )
}
