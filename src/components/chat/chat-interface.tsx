"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAiResponse } from '@/app/chat/actions';
import { MessageContent } from './message-content';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CommitRequest {
  repoUrl: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface() {
  const [uploadedFileContent, setUploadedFileContent] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [analysisUrl, setAnalysisUrl] = useState('');
  const [userProblem, setUserProblem] = useState('');

  const [commitUrl, setCommitUrl] = useState('');

  const fetchCommitFiles = async (commitUrl: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GITHUB_API_KEY;
      const match = commitUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/commit\/([a-f0-9]+)/i);
      if (!match) throw new Error('URL de commit inválida');
      const owner = match[1];
      const repo = match[2];
      const sha = match[3];

      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${apiKey}`,
      };
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`, { headers });
      if (!res.ok) throw new Error('No se pudo obtener el commit');
      const data = await res.json();

      let filesContent = '';
      for (const file of data.files.slice(0, 2)) {
        if (file.filename.match(/\.(js|ts|tsx|md|txt|json)$/)) {
          const rawRes = await fetch(file.raw_url, { headers });
          const content = await rawRes.text();
          filesContent += `Archivo: ${file.filename}\n${content.slice(0, 500)}${content.length > 500 ? '\n... (truncado)' : ''}\n\n`;
        } else {
          filesContent += `Archivo: ${file.filename}\n(No se muestra contenido de archivos binarios)\n\n`;
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `Leer archivos del commit: ${commitUrl}` },
        { role: 'assistant', content: filesContent || 'No se encontraron archivos de texto en el commit.' }
      ]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');

  const fetchCommitsFromUrl = async ({ repoUrl }: CommitRequest) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GITHUB_API_KEY;
      const match = repoUrl.match(/github.com\/(.+?)\/(.+?)(?:\.|\/|$)/);
      if (!match) throw new Error('URL de repositorio inválida');
      const owner = match[1];
      const repo = match[2];
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${apiKey}`,
      };
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, { headers });
      if (!res.ok) throw new Error('No se pudo obtener los commits');
      const data = await res.json();
      const commits = data.slice(0, 5).map((commit: any) => `• ${commit.commit.message} (${commit.sha.substring(0,7)})`).join('\n');
      setMessages((prev) => [...prev, { role: 'user', content: `Commits de ${owner}/${repo}` }]);
      setMessages((prev) => [...prev, { role: 'assistant', content: `Últimos commits:\n${commits}` }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error al leer commits: ${err.message}` }]);
    }
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Si hay archivo subido, mostrarlo en el chat y enviarlo a la IA para análisis
    if (uploadedFileContent) {
      const consulta = input.trim() ? `${input}\n\nContenido del archivo subido:\n${uploadedFileContent}` : `Contenido del archivo subido:\n${uploadedFileContent}`;
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `Consulta: ${input}` },
        { role: 'user', content: `<pre><code>${uploadedFileContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>` }
      ]);
      setInput('');
      setIsLoading(true);
      const result = await getAiResponse({ query: consulta });
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        } else if (result.response) {
          setMessages((prev) => [...prev, { role: "assistant", content: result.response ?? "" }]);
      }
      setIsLoading(false);
      setUploadedFileContent(null);
      return;
    }
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Detectar URL de commit/pull y problema en el input
    const urlMatch = input.match(/https?:\/\/github\.com\/[^\s]+/);
    let userContent = input;
    let url = '';
    let problem = '';
    if (urlMatch) {
      url = urlMatch[0];
      problem = input.replace(url, '').trim();
      // Renderizar solo el link real, sin formato extra
      userContent = `${url} ${problem}`;
    }
    const userMessage: Message = { role: 'user', content: userContent };
    setMessages((prev) => [...prev, userMessage]);

    // Si hay URL de commit/pull, procesar automáticamente el análisis
    if (url) {
      const apiKey = process.env.NEXT_PUBLIC_GITHUB_API_KEY;
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/(commit|pull)\/(\w+)/i);
      if (match) {
        const owner = match[1];
        const repo = match[2];
        const type = match[3];
        const id = match[4];
        let files = [];
        let commitMessage = '';
        try {
          if (type === 'commit') {
            const headers = {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': `Bearer ${apiKey}`,
            };
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${id}`, { headers });
            if (!res.ok) throw new Error('No se pudo obtener el commit');
            const data = await res.json();
            files = data.files;
            commitMessage = data.commit.message;
          } else if (type === 'pull') {
            const headers = {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': `Bearer ${apiKey}`,
            };
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${id}/files`, { headers });
            if (!res.ok) throw new Error('No se pudo obtener el pull request');
            files = await res.json();
          }
          let analysis = `Análisis del ${type} en ${url}:\n\n`;
          if (commitMessage) analysis += `Mensaje: ${commitMessage}\n\n`;
          analysis += `Archivos modificados:\n`;
          for (const file of files) {
            analysis += `- ${file.filename}\n`;
            analysis += `  Líneas añadidas: ${file.additions}, eliminadas: ${file.deletions}\n`;
            analysis += `  Cambios:\n${file.patch ? file.patch.slice(0, 500) : '(No disponible)'}\n`;
            // Mostrar contenido real del archivo si es de texto y tiene raw_url
            if (file.raw_url && file.filename.match(/\.(js|ts|tsx|md|txt|json)$/)) {
              try {
                const rawRes = await fetch(file.raw_url, {
                  headers: {
                    'Accept': 'application/vnd.github.v3.raw',
                    'Authorization': `Bearer ${apiKey}`,
                  }
                });
                if (rawRes.ok) {
                  const content = await rawRes.text();
                  analysis += `  Contenido del archivo (primeros 500 caracteres):\n${content.slice(0, 500)}${content.length > 500 ? '\n... (truncado)' : ''}\n`;
                } else {
                  analysis += `  No se pudo obtener el contenido del archivo.\n`;
                }
              } catch {
                analysis += `  Error al leer el contenido del archivo.\n`;
              }
            } else {
              analysis += `  (No se muestra contenido de archivos binarios o sin raw_url)\n`;
            }
            analysis += `\n`;
          }

          // Leer el contenido completo del repositorio (solo archivos de texto, hasta 10 archivos para no saturar)
          let repoFilesContent = '';
          try {
            const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`, {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${apiKey}`,
              }
            });
            if (treeRes.ok) {
              const treeData = await treeRes.json();
              const textFiles = treeData.tree.filter((f: any) => f.type === 'blob' && f.path.match(/\.(js|ts|tsx|md|txt|json)$/));
              for (const file of textFiles.slice(0, 10)) {
                try {
                  const fileRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`);
                  if (fileRes.ok) {
                    const content = await fileRes.text();
                    repoFilesContent += `Archivo del repo: ${file.path}\n${content.slice(0, 1000)}${content.length > 1000 ? '\n... (truncado)' : ''}\n\n`;
                  } else {
                    repoFilesContent += `Archivo del repo: ${file.path}\nNo se pudo obtener el contenido.\n\n`;
                  }
                } catch {
                  repoFilesContent += `Archivo del repo: ${file.path}\nError al leer el contenido.\n\n`;
                }
              }
            } else {
              repoFilesContent = 'No se pudo obtener la lista de archivos del repositorio.';
            }
          } catch {
            repoFilesContent = 'Error al leer los archivos del repositorio.';
          }

          let suggestion = 'Revisa los cambios y busca posibles errores en las líneas modificadas.';
          if (files.some((f: any) => f.patch && f.patch.includes('console.log'))) {
            suggestion += '\nSugerencia: Elimina los console.log antes de subir a producción.';
          }
          if (files.some((f: any) => f.patch && f.patch.includes('any'))) {
            suggestion += '\nSugerencia: Evita el uso de "any" en TypeScript.';
          }
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: analysis + '\n' + repoFilesContent + '\n' + suggestion }
          ]);
        } catch (err: any) {
          setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
        }
      }
    }
    setInput('');
    setIsLoading(true);

    const result = await getAiResponse({ query: input });

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages(prev => prev.slice(0, -1)); 
    } else if (result.response) {
      const assistantMessage: Message = { role: 'assistant', content: result.response };
      setMessages((prev) => [...prev, assistantMessage]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 md:p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
                <Bot className="h-16 w-16 text-primary/50" />
                <h2 className="mt-4 text-2xl font-semibold font-headline">Welcome to Kody AI</h2>
                <p className="mt-2 text-muted-foreground">Ask me anything about web development.</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : '')}>
              {message.role === 'assistant' && (
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                "max-w-xl rounded-lg p-3 text-sm",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border'
              )}>
                {/* Si el mensaje contiene un bloque de código, mostrarlo en <pre><code> */}
                {message.role === 'assistant' && /```[a-zA-Z]*[\s\S]*```/.test(message.content) ? (
                  message.content.split(/```([a-zA-Z]*)\n([\s\S]*?)```/g).map((part, i, arr) => {
                    // Si es el contenido de código
                    if (i % 3 === 2) {
                      const lang = arr[i - 1] || '';
                      const code = part;
                      return (
                        <div key={i} style={{ position: 'relative', marginBottom: '1em' }}>
                          <pre style={{ background: '#222', color: '#fff', padding: '1em', borderRadius: '8px', overflowX: 'auto' }}>
                            <code>{code}</code>
                          </pre>
                          <button
                            style={{ position: 'absolute', top: 8, right: 8, background: '#444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.3em 0.7em', cursor: 'pointer', fontSize: '0.9em' }}
                            onClick={async () => {
                              await navigator.clipboard.writeText(code);
                              setCopiedIndex(i);
                              setTimeout(() => setCopiedIndex(null), 1500);
                            }}
                            title="Copiar código"
                          >
                            {copiedIndex === i ? '¡Copiado!' : 'Copiar'}
                          </button>
                        </div>
                      );
                    }
                    // Si es texto normal
                    if (i % 3 === 0 && part.trim()) {
                      // Convertir links en texto en enlaces clicables
                      const withLinks = part.replace(/(https?:\/\/[^\s*]+)/g, (url) => `<a href='${url}' target='_blank' rel='noopener noreferrer' style='color:#2563eb;text-decoration:underline;'>${url}</a>`);
                      // Convertir * **`text`**: en formato de lista
                      const withList = withLinks.replace(/\* \*\*`([^`]+)`\*\*:/g, '<li><b><code>$1</code></b>:</li>');
                      // Convertir * [text](url) en enlaces
                      const withMdLinks = withList.replace(/\* \[([^\]]+)\]\(([^\)]+)\)/g, `<li><a href='$2' target='_blank' rel='noopener noreferrer' style='color:#2563eb;text-decoration:underline;'>$1</a></li>`);
                      // Renderizar como HTML seguro
                      return <div key={i} dangerouslySetInnerHTML={{ __html: withMdLinks }} />;
                    }
                    return null;
                  })
                ) : (
                  // Para mensajes sin código, mostrar todos los links como enlaces clicables
                  (() => {
                    let text = message.content;
                    // Renderizar negrita markdown como <b>
                    text = text.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
                    // Eliminar triple asteriscos y cursiva
                    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
                    text = text.replace(/\*([^*]+)\*/g, '$1');
                    // Links como enlaces clicables
                    text = text.replace(/(https?:\/\/[^\s*]+)/g, (url) => `<a href='${url}' target='_blank' rel='noopener noreferrer' style='color:#2563eb;text-decoration:underline;'>${url}</a>`);
                    return <div dangerouslySetInnerHTML={{ __html: text }} />;
                  })()
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-9 w-9 border">
                    <AvatarImage src="/images.jpg" alt="User" data-ai-hint="person avatar"/>
                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9 border">
                    <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                </Avatar>
                <div className="max-w-xl rounded-lg p-3 text-sm bg-card border flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-card p-4 md:p-6">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <div className="flex w-full items-center gap-2">
            <Textarea
              placeholder="Type your web development question here..."
              className="min-h-[48px] resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                }
              }}
              disabled={isLoading}
            />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="file-upload"
                type="file"
                accept=".py,.tsx,.js,.ts,.md,.json,.txt"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const text = await file.text();
                    setUploadedFileContent(text);
                    setMessages((prev) => [
                      ...prev,
                      { role: 'user', content: `Archivo subido: ${file.name}` },
                      { role: 'assistant', content: `Archivo recibido correctamente. Puedes pedir correcciones o análisis sobre el archivo subido.` }
                    ]);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-primary text-primary-foreground border rounded px-2 py-1 flex items-center justify-center hover:bg-primary/80 transition"
                style={{ minWidth: 32, height: 32, fontSize: '0.9em', marginRight: '4px' }}
                title="Subir archivo"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3V15M10 15L5 10M10 15L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <Button type="submit" size="icon" className="ml-1" disabled={isLoading || !input.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
