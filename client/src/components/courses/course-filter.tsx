import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Category {
  id: number;
  name: string;
  count?: number;
}

interface CourseFilterProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
}

export function CourseFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel,
}: CourseFilterProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Lọc khóa học</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-6">
        <Accordion type="multiple" defaultValue={["categories", "level", "price"]} className="space-y-4">
          <AccordionItem value="categories" className="border-b-0">
            <AccordionTrigger className="py-2">Danh mục</AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="all-categories" 
                    checked={selectedCategory === "all"}
                    onCheckedChange={() => setSelectedCategory("all")}
                  />
                  <Label htmlFor="all-categories" className="flex-1 text-sm cursor-pointer">
                    Tất cả
                  </Label>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      checked={selectedCategory === category.id.toString()}
                      onCheckedChange={() => setSelectedCategory(category.id.toString())}
                    />
                    <Label 
                      htmlFor={`category-${category.id}`} 
                      className="flex-1 text-sm cursor-pointer flex justify-between"
                    >
                      <span>{category.name}</span>
                      {category.count && <span className="text-muted-foreground">({category.count})</span>}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="level" className="border-b-0">
            <AccordionTrigger className="py-2">Trình độ</AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <RadioGroup 
                value={selectedLevel} 
                onValueChange={setSelectedLevel}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="all" id="all-levels" />
                  <Label htmlFor="all-levels" className="cursor-pointer">Tất cả</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner" className="cursor-pointer">Cơ bản</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate" className="cursor-pointer">Trung cấp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced" className="cursor-pointer">Nâng cao</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price" className="border-b-0">
            <AccordionTrigger className="py-2">Giá</AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-all" />
                  <Label htmlFor="price-all" className="cursor-pointer">Tất cả</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-free" />
                  <Label htmlFor="price-free" className="cursor-pointer">Miễn phí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-paid" />
                  <Label htmlFor="price-paid" className="cursor-pointer">Trả phí</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Separator className="my-4" />
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setSelectedCategory("all");
            setSelectedLevel("all");
          }}
        >
          Xóa bộ lọc
        </Button>
      </CardContent>
    </Card>
  );
}
