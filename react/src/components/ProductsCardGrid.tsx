import FeatureCardGrid, { FeatureCardProps } from "./ui/FeatureCardGrid";


function FeatureCardDemo() {
  const sampleItems: FeatureCardProps[] = [
    {
      id: "1",
      title: "Yoga Classes",
      description: "Improve flexibility and mindfulness with guided yoga.",
      imageSrc:
        "https://images.unsplash.com/photo-1554306274-f23873d9a26b?auto=format&fit=crop&w=600&q=80",
      tags: ["wellness", "fitness"],
      actions: [
        { id: "book", label: "Book Now", onClick: () => alert("Booked Yoga") },
        { id: "info", label: "More Info", onClick: () => alert("Yoga Info") },
        { id: "share", label: "Share", onClick: () => alert("Yoga Shared") },
      ],
    },
    {
      id: "2",
      title: "Swimming Pool",
      description: "Relax and train in our temperature-controlled pool.",
      imageSrc:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      tags: ["aqua", "relax"],
      actions: [
        { id: "join", label: "Join Now", onClick: () => alert("Joined Swimming") },
      ],
    },
    {
      id: "3",
      title: "Healthy Café",
      description: "Wholesome meals and smoothies crafted with care.",
      imageSrc:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
      tags: ["organic", "food"],
      actions: [
        { id: "menu", label: "View Menu", onClick: () => alert("Viewing Menu") },
      ],
    },
  ];

  return <FeatureCardGrid items={sampleItems} columns={3} />;
}

export default FeatureCardDemo

