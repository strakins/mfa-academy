import StatCard from "./StatCard"

const StatsList = () => {
  return (
    <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, idx) => (
            <StatCard key={s.label} {...s} delay={0.16 + idx * 0.03} />
        ))}
    </div>
  )
}

export default StatsList
