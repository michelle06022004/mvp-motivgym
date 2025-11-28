"use client";

import { useState } from "react";
import { Plus, Users, Search, Trophy, Settings, History, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Group = {
  id: string;
  name: string;
  description: string;
  category: string;
  isPrivate: boolean;
  inviteCode: string;
  members: number;
  challenges: Challenge[];
};

type Challenge = {
  id: string;
  name: string;
  description: string;
  duration: number;
  rules: string;
  checkInType: string;
  participants: Participant[];
};

type Participant = {
  id: string;
  name: string;
  checkIns: number;
  lastCheckIn?: string;
};

export default function MotivGym() {
  const [view, setView] = useState<"home" | "group">("home");
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "Treino Matinal",
      description: "Grupo para quem treina de manhã",
      category: "Musculação",
      isPrivate: false,
      inviteCode: "MANHA123",
      members: 12,
      challenges: [],
    },
    {
      id: "2",
      name: "Corrida 5K",
      description: "Preparação para corrida de 5km",
      category: "Corrida",
      isPrivate: false,
      inviteCode: "RUN5K456",
      members: 8,
      challenges: [],
    },
  ]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [joinGroupOpen, setJoinGroupOpen] = useState(false);
  const [createChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);

  // Form states
  const [groupForm, setGroupForm] = useState({
    name: "",
    description: "",
    category: "",
    isPrivate: "false",
  });
  const [joinCode, setJoinCode] = useState("");
  const [challengeForm, setChallengeForm] = useState({
    name: "",
    description: "",
    duration: "",
    rules: "",
    checkInType: "",
  });

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGroup = () => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupForm.name,
      description: groupForm.description,
      category: groupForm.category,
      isPrivate: groupForm.isPrivate === "true",
      inviteCode: generateInviteCode(),
      members: 1,
      challenges: [],
    };
    setGroups([...groups, newGroup]);
    setSelectedGroup(newGroup);
    setView("group");
    setCreateGroupOpen(false);
    setGroupForm({ name: "", description: "", category: "", isPrivate: "false" });
  };

  const handleJoinGroup = () => {
    const group = groups.find((g) => g.inviteCode === joinCode.toUpperCase());
    if (group) {
      group.members += 1;
      setSelectedGroup(group);
      setView("group");
      setJoinGroupOpen(false);
      setJoinCode("");
    }
  };

  const handleCreateChallenge = () => {
    if (!selectedGroup) return;
    const newChallenge: Challenge = {
      id: Date.now().toString(),
      name: challengeForm.name,
      description: challengeForm.description,
      duration: parseInt(challengeForm.duration),
      rules: challengeForm.rules,
      checkInType: challengeForm.checkInType,
      participants: [],
    };
    selectedGroup.challenges.push(newChallenge);
    setCreateChallengeOpen(false);
    setChallengeForm({ name: "", description: "", duration: "", rules: "", checkInType: "" });
  };

  const handleCheckIn = () => {
    // Lógica de check-in seria implementada aqui
    setCheckInOpen(false);
  };

  if (view === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              MotivGym
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Gerenciamento de grupos e desafios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">Criar Grupo</CardTitle>
                    <CardDescription>Inicie um novo grupo de treino</CardDescription>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Novo Grupo</DialogTitle>
                  <DialogDescription>Preencha as informações do grupo</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Grupo</Label>
                    <Input
                      id="name"
                      value={groupForm.name}
                      onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                      placeholder="Ex: Treino Matinal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={groupForm.description}
                      onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                      placeholder="Descreva o objetivo do grupo"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={groupForm.category} onValueChange={(value) => setGroupForm({ ...groupForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Musculação">Musculação</SelectItem>
                        <SelectItem value="Corrida">Corrida</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="Crossfit">Crossfit</SelectItem>
                        <SelectItem value="Natação">Natação</SelectItem>
                        <SelectItem value="Ciclismo">Ciclismo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privacy">Privacidade</Label>
                    <Select value={groupForm.isPrivate} onValueChange={(value) => setGroupForm({ ...groupForm, isPrivate: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Público</SelectItem>
                        <SelectItem value="true">Privado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateGroup} className="w-full" disabled={!groupForm.name || !groupForm.category}>
                    Criar Grupo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={joinGroupOpen} onOpenChange={setJoinGroupOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-green-500">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <UserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-xl">Entrar com Código</CardTitle>
                    <CardDescription>Use um código de convite</CardDescription>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Entrar em um Grupo</DialogTitle>
                  <DialogDescription>Digite o código de convite do grupo</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Código de Convite</Label>
                    <Input
                      id="code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Ex: MANHA123"
                      className="uppercase"
                    />
                  </div>
                  {joinCode && groups.find((g) => g.inviteCode === joinCode.toUpperCase()) && (
                    <Card className="bg-slate-50 dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-base">
                          {groups.find((g) => g.inviteCode === joinCode.toUpperCase())?.name}
                        </CardTitle>
                        <CardDescription>
                          {groups.find((g) => g.inviteCode === joinCode.toUpperCase())?.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {groups.find((g) => g.inviteCode === joinCode.toUpperCase())?.members} membros
                          </span>
                          <Badge variant="secondary">
                            {groups.find((g) => g.inviteCode === joinCode.toUpperCase())?.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <Button onClick={handleJoinGroup} className="w-full" disabled={!joinCode || !groups.find((g) => g.inviteCode === joinCode.toUpperCase())}>
                    Entrar no Grupo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-500">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Explorar Grupos</CardTitle>
                <CardDescription>Descubra grupos públicos</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Grupos Públicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.filter((g) => !g.isPrivate).map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{group.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{group.category}</Badge>
                        <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <Users className="w-4 h-4" />
                          {group.members}
                        </span>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedGroup(group);
                          setView("group");
                        }}
                        className="w-full"
                        variant="outline"
                      >
                        Ver Grupo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "group" && selectedGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-6">
            <Button onClick={() => setView("home")} variant="ghost" className="mb-4">
              ← Voltar
            </Button>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {selectedGroup.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-3">{selectedGroup.description}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{selectedGroup.category}</Badge>
                  <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <Users className="w-4 h-4" />
                    {selectedGroup.members} membros
                  </span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configurações do Grupo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Código de Convite</Label>
                      <div className="flex items-center gap-2">
                        <Input value={selectedGroup.inviteCode} readOnly />
                        <Button variant="outline" size="sm">Copiar</Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Privacidade</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedGroup.isPrivate ? "Grupo Privado" : "Grupo Público"}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="challenges" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="challenges">Desafios</TabsTrigger>
              <TabsTrigger value="ranking">Ranking</TabsTrigger>
              <TabsTrigger value="members">Participantes</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="challenges" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Desafios Ativos</h2>
                <Dialog open={createChallengeOpen} onOpenChange={setCreateChallengeOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Desafio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Desafio</DialogTitle>
                      <DialogDescription>Configure um desafio manual para o grupo</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="challenge-name">Nome do Desafio</Label>
                        <Input
                          id="challenge-name"
                          value={challengeForm.name}
                          onChange={(e) => setChallengeForm({ ...challengeForm, name: e.target.value })}
                          placeholder="Ex: 30 dias de treino"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="challenge-description">Descrição</Label>
                        <Textarea
                          id="challenge-description"
                          value={challengeForm.description}
                          onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                          placeholder="Descreva o objetivo do desafio"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duração (dias)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={challengeForm.duration}
                          onChange={(e) => setChallengeForm({ ...challengeForm, duration: e.target.value })}
                          placeholder="Ex: 30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rules">Regras</Label>
                        <Textarea
                          id="rules"
                          value={challengeForm.rules}
                          onChange={(e) => setChallengeForm({ ...challengeForm, rules: e.target.value })}
                          placeholder="Defina as regras do desafio"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="check-in-type">Tipo de Check-in</Label>
                        <Select value={challengeForm.checkInType} onValueChange={(value) => setChallengeForm({ ...challengeForm, checkInType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Diário</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="photo">Foto</SelectItem>
                            <SelectItem value="text">Texto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleCreateChallenge}
                        className="w-full"
                        disabled={!challengeForm.name || !challengeForm.duration || !challengeForm.checkInType}
                      >
                        Criar Desafio
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {selectedGroup.challenges.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">Nenhum desafio criado ainda</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                      Crie o primeiro desafio para o grupo
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedGroup.challenges.map((challenge) => (
                    <Card key={challenge.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{challenge.name}</CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Duração:</span>
                            <span className="font-medium">{challenge.duration} dias</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Check-in:</span>
                            <Badge variant="outline">{challenge.checkInType}</Badge>
                          </div>
                          <Separator />
                          <div className="text-sm">
                            <p className="text-slate-600 dark:text-slate-400 mb-1">Regras:</p>
                            <p className="text-slate-700 dark:text-slate-300">{challenge.rules}</p>
                          </div>
                          <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Fazer Check-in
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Check-in: {challenge.name}</DialogTitle>
                                <DialogDescription>Confirme sua participação no desafio de hoje</DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                  Tipo de check-in: <Badge variant="outline">{challenge.checkInType}</Badge>
                                </p>
                                {challenge.checkInType === "text" && (
                                  <Textarea placeholder="Descreva seu treino de hoje..." rows={4} />
                                )}
                                <Button onClick={handleCheckIn} className="w-full mt-4">
                                  Confirmar Check-in
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="ranking">
              <Card>
                <CardHeader>
                  <CardTitle>Ranking do Grupo</CardTitle>
                  <CardDescription>Classificação baseada em check-ins realizados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">Ranking em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>Participantes</CardTitle>
                  <CardDescription>{selectedGroup.members} membros no grupo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">Lista de participantes em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Seu Histórico</CardTitle>
                  <CardDescription>Acompanhe sua evolução no grupo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <History className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">Histórico em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return null;
}
