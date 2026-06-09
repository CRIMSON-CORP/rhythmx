import { List, Plus, Search } from "lucide-react";
import Icon from "@/components/icon";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Team from "@/components/team";
import { teams } from "@/data/team";
import TeamForm from "@/components/team-form";

function DisocgraphyPage() {
  return (
    <div className="flex flex-col gap-6 h-full overflow-auto">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
          <span>Team</span>
          <div className="bg-white flex items-center gap-2.5 px-5 py-4 rounded-full font-sans font-medium max-sm:hidden">
            <span className="text-sm text-border-default-secondary">Total Team</span>
            <span className="text-base">43</span>
          </div>
        </h1>
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          <Dialog>
            <DialogTrigger className="bg-black text-white p-4 rounded-full flex items-center gap-2 whitespace-nowrap">
              <span className="leading-tight">New Team</span>
              <Plus size={16} />
            </DialogTrigger>
            <TeamForm />
          </Dialog>
        </div>
      </div>
      <section className="flex flex-col gap-8 pt-8 pb-4 h-full overflow-auto">
        <header className="container flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-medium whitespace-nowrap">All Team</h2>
          <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
            <div className="flex items-center p-4 gap-x-2">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search team by name, email or phone"
                className="bg-transparent outline-none"
              />
            </div>
            <Select defaultValue="any">
              <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
                <span>Filter:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start" className="outline-0! p-2">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="any">
              <SelectTrigger className="bg-white rounded-full flex px-4 py-3 items-center">
                <span>Sort:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start" className="outline-0! p-2">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center px-4 py-3 gap-2 bg-white rounded-full">
              <button>
                <Icon name="circles-four" size={18} />
              </button>
              <span className="w-px h-4 bg-default-default/20" />
              <button>
                <List size={18} />
              </button>
            </div>
          </div>
        </header>
        <div className="container h-full overflow-auto">
          <div className="bg-white rounded-30 p-3 md:p-8 grid grid-cols-[repeat(auto-fill,minmax(min(168px,100%),1fr))] gap-8">
            {teams.map((artist) => (
              <Team
                id={artist.id}
                key={artist.id}
                image={artist.image}
                name={artist.name}
                role={artist.role}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DisocgraphyPage;
