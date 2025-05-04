import { useState } from "react";
import { roadmapData, detailedRoadmaps } from "@/lib/data";
import RoadmapCard from "@/components/RoadmapCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Roadmap() {
  const [activeTab, setActiveTab] = useState("all");

  const filterRoadmaps = () => {
    if (activeTab === "all") return roadmapData;
    return roadmapData.filter(roadmap => roadmap.category === activeTab);
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Lộ Trình Học Tập</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Lựa chọn lộ trình phù hợp với mục tiêu nghề nghiệp của bạn.
          </p>
        </div>
      </div>

      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center mb-8">
            <button 
              className={`roadmap-tab ${activeTab === "all" ? "bg-white text-primary border border-primary" : "bg-white text-dark border border-gray-300"} px-4 py-2 m-1 rounded-md font-medium`}
              onClick={() => setActiveTab("all")}
            >
              Tất cả
            </button>
            <button 
              className={`roadmap-tab ${activeTab === "beginners" ? "bg-white text-primary border border-primary" : "bg-white text-dark border border-gray-300"} px-4 py-2 m-1 rounded-md font-medium`}
              onClick={() => setActiveTab("beginners")}
            >
              Người mới bắt đầu
            </button>
            <button 
              className={`roadmap-tab ${activeTab === "career" ? "bg-white text-primary border border-primary" : "bg-white text-dark border border-gray-300"} px-4 py-2 m-1 rounded-md font-medium`}
              onClick={() => setActiveTab("career")}
            >
              Chuyển ngành
            </button>
            <button 
              className={`roadmap-tab ${activeTab === "specialization" ? "bg-white text-primary border border-primary" : "bg-white text-dark border border-gray-300"} px-4 py-2 m-1 rounded-md font-medium`}
              onClick={() => setActiveTab("specialization")}
            >
              Chuyên sâu
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filterRoadmaps().map((roadmap, index) => (
              <RoadmapCard key={index} {...roadmap} />
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Chi Tiết Lộ Trình Học Tập</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {detailedRoadmaps.map((roadmap, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-xl font-semibold">
                    {roadmap.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 pt-2">
                      {roadmap.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-4">
                          <h4 className="text-lg font-medium mb-2">{section.title}</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-gray-700">{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
