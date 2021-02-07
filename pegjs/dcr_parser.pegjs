{
  var graphs = [];
  var top = function() {return graphs[graphs.length-1];}    
}

File
    = _ g:DCRGraph _ {return g}
    
DCRGraph
    = !{graphs.push(new DCRGraph(top()))}    
    (Relation / Event / Empty) ((_ Nxt _ (Relation / Event) _ ) / (_ EOL _))*
    {return graphs.pop()}

Event
    =  
        n:Name _ l:Label _ m:Marking __ '{' __ g:DCRGraph __ '}' {top().addEvent(n, l, m, g)} /
        n:Name _ m:Marking __ '{' __ g:DCRGraph __ '}' {top().addEvent(n, n, m, g)} /
        n:Name _ l:Label _ m:Marking {top().addEvent(n, l, m)} /
        n:Name _ m:Marking {top().addEvent(n, n, m )}

Marking
    = '()' {return {ex: false, in: true, pe: false}} / 
      '(' _ b1:Bool Sep b2:Bool Sep b3:Bool _ ')' {return {ex: b1, in: b2, pe: b3}} /
      Empty {return {ex: false, in: true, pe: false}}

Relation
    = es1:Eventids _ '-' d:Time g:Guard '->*'  _ es2:Eventids {for (var e1 of es1) for (var e2 of es2) top().addCondition(e1, e2, d, g);} /
      es1:Eventids _ '-' g:Guard '-><>' _ es2:Eventids {for (var e1 of es1) for (var e2 of es2) top().addMilestone(e1, e2, g);} /
      es1:Eventids _ '*-' d:Time g:Guard '->'  _ es2:Eventids {for (var e1 of es1) for (var e2 of es2) top().addResponse(e1, e2, d, g);} /
      es1:Eventids _ '-' g:Guard '->+'  _ es2:Eventids {for (var e1 of es1) for (var e2 of es2) top().addInclude(e1, e2, g);} /
      es1:Eventids _ '-' g:Guard '->%'  _ es2:Eventids {for (var e1 of es1) for (var e2 of es2) top().addExclude(e1, e2, g);}

Time 
	= '(' i:Integer ')' {return i;}    
    / Empty {return undefined;} 
      
Guard
	= '[' exp:Expression ']' {return exp;} // TODO
      / Empty {return true;}

Expression = ""

Eventids
    = n:Name {return [n]} / '(' ns:Names ')' {return ns}

Names
    = n:Name Sep ns:Names {ns.push(n); return ns} / n:Name {return [n]}

Name 
    = t:Text ws:(' ')+ n:Name {return t.concat(ws.join(''), n)} /
      Text

Text
    = str:([a-z] / [A-Z] / [0-9] / '_')+ {return str.join('')}

Label 
    = '<' lab:([a-z] / [A-Z] / [0-9] / '_' / '-' / ' ')+ '>' {return (lab.join(''))}

Bool
    = '0' {return false} / '1' {return true} / 'false' {return false} / 'true' {return true}
      / 'f' {return false} / 't' {return true}

Integer "Integer"
  = _ [0-9]+ { return parseInt(text(), 10); }
    
// Seperator
Nxt = (EOL / EOF / ';')

EOL = ('\r\n' / '\n')

EOF = !.

Sep = _ ',' _

// whitespace
_ = (' ' / '\t')*

__  = (' ' / '\t' / EOL)*

Empty
    = ""